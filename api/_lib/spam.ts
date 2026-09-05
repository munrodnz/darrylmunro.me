// ── SPAM SCORING ──────────────────────────────────────────────
// Belt-and-braces behind Turnstile. Signals are scored rather than treated as
// hard blocks so that no single weak match can bin a real enquiry.

export const TAG_THRESHOLD = 3; // Deliver, but prefix the subject with [SPAM?]
export const DROP_THRESHOLD = 5; // Discard silently

/**
 * Phrases lifted from the observed wave. These are list-subscription requests,
 * which is not something a real enquiry to a fractional CTO ever opens with.
 */
const TEMPLATE_PHRASES = [
  /please (send|add) me (updates|for news)/i,
  /i am interested in your latest news/i,
  /i would like more information\.?\s*please contact me by email/i,
  /please let me know when i am subscribed/i,
  /i'?m interested in (weekly|daily|monthly) updates/i,
  /interested in (your )?(newsletter|product news|company news)/i,
  /i want to stay informed/i,
];

const URL_PATTERN = /(https?:\/\/|www\.)\S+/gi;
const BBCODE_PATTERN = /\[url[=\]]/i;
// Cyrillic and Greek ranges, commonly used for homoglyph evasion.
const HOMOGLYPH_PATTERN = /[Ѐ-ӿͰ-Ͽ]/;

export type SpamAssessment = {
  score: number;
  reasons: string[];
};

export function scoreSubmission(input: {
  name: string;
  email: string;
  message: string;
}): SpamAssessment {
  const reasons: string[] = [];
  let score = 0;

  const matchedPhrases = TEMPLATE_PHRASES.filter((pattern) => pattern.test(input.message));
  if (matchedPhrases.length > 0) {
    // Cap so a single templated body cannot alone exceed the drop threshold,
    // but two distinct template phrases can.
    const phraseScore = Math.min(matchedPhrases.length * 3, 6);
    score += phraseScore;
    reasons.push(`template-phrase x${matchedPhrases.length}`);
  }

  const urls = input.message.match(URL_PATTERN) || [];
  if (urls.length >= 3) {
    score += 2;
    reasons.push(`links x${urls.length}`);
  } else if (urls.length > 0) {
    score += 1;
    reasons.push("contains-link");
  }

  if (BBCODE_PATTERN.test(input.message)) {
    score += 3;
    reasons.push("bbcode");
  }

  if (HOMOGLYPH_PATTERN.test(`${input.name} ${input.message}`)) {
    score += 2;
    reasons.push("homoglyphs");
  }

  if (input.message.trim().length < 40) {
    score += 1;
    reasons.push("very-short");
  }

  // Real senders type their own name; bots draw first/last from a list and
  // frequently produce a name with no relationship to the local part.
  if (/^[a-z]+ [a-z]+$/i.test(input.name.trim())) {
    const local = input.email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z]/g, "");
    const parts = input.name.toLowerCase().split(/\s+/);
    const shares = parts.some((part) => part.length > 2 && local.includes(part));
    if (!shares) {
      score += 1;
      reasons.push("name-email-mismatch");
    }
  }

  return { score, reasons };
}
