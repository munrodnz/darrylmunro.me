// ── RATE LIMITING ─────────────────────────────────────────────
// Vercel's WAF rate-limit rules are Pro-only, so this is enforced in the
// function. Uses Upstash Redis over its REST API when configured (shared
// across every serverless instance); otherwise falls back to a per-instance
// in-memory counter, which is weaker but still blunts a burst from one source.

export type Limit = {
  /** Key suffix, e.g. `ip:203.0.113.4`. */
  key: string;
  /** Max requests allowed within the window. */
  max: number;
  /** Window length in seconds. */
  windowSeconds: number;
};

export type RateLimitResult = {
  limited: boolean;
  /** Which limit tripped, for logging. */
  trippedBy?: string;
};

// Accept both naming schemes: UPSTASH_* when the credentials are pasted in by
// hand from the Upstash console, KV_REST_API_* when the database is provisioned
// through Vercel's marketplace integration, which names them differently.
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// ── In-memory fallback ────────────────────────────────────────
const memory = new Map<string, { count: number; expiresAt: number }>();

function incrementInMemory(limit: Limit): number {
  const now = Date.now();
  const entry = memory.get(limit.key);

  if (!entry || entry.expiresAt <= now) {
    memory.set(limit.key, {
      count: 1,
      expiresAt: now + limit.windowSeconds * 1000,
    });
    return 1;
  }

  entry.count += 1;

  // Opportunistic sweep so the map cannot grow without bound.
  if (memory.size > 1000) {
    for (const [key, value] of memory) {
      if (value.expiresAt <= now) memory.delete(key);
    }
  }

  return entry.count;
}

// ── Upstash Redis over REST ───────────────────────────────────
async function incrementInRedis(limits: Limit[]): Promise<number[]> {
  // One pipelined round trip: INCR then EXPIRE ... NX for each limit, so the
  // TTL is set only when the key is first created and the window is fixed.
  const commands = limits.flatMap((limit) => [
    ["INCR", `contact:${limit.key}`],
    ["EXPIRE", `contact:${limit.key}`, String(limit.windowSeconds), "NX"],
  ]);

  const response = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(2000),
  });

  if (!response.ok) {
    throw new Error(`Upstash responded ${response.status}`);
  }

  const results = (await response.json()) as Array<{ result?: number }>;

  // Results interleave INCR/EXPIRE pairs; take the INCR at every even index.
  return limits.map((_, index) => Number(results[index * 2]?.result ?? 0));
}

/**
 * Increments every limit and reports whether any was exceeded.
 * Fails open — if the Redis call errors we would rather accept a message than
 * silently reject a real enquiry.
 */
export async function checkRateLimits(limits: Limit[]): Promise<RateLimitResult> {
  let counts: number[];

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      counts = await incrementInRedis(limits);
    } catch (err) {
      console.error("Rate limit backend unavailable, falling back:", err);
      counts = limits.map(incrementInMemory);
    }
  } else {
    counts = limits.map(incrementInMemory);
  }

  for (const [index, limit] of limits.entries()) {
    if (counts[index] > limit.max) {
      return { limited: true, trippedBy: limit.key };
    }
  }

  return { limited: false };
}

/** Best-effort client IP behind Vercel's proxy. */
export function clientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const first = value?.split(",")[0]?.trim();
  if (first) return first;

  const real = headers["x-real-ip"];
  return (Array.isArray(real) ? real[0] : real) || "unknown";
}
