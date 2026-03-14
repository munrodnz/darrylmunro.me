import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Darryl Munro

Strong opinions, loosely held. Enterprise architecture, AI, neurodiversity, and pragmatic human systems.

## Navigation

- [About](/about.md)
- [Writing](/posts.md)
- [Services](/services)
- [Contact](/contact)
- [RSS Feed](/rss.xml)

## Links

- GitHub: [@darrylmunro](https://github.com/munrodnz)
- LinkedIn: [darryl-munro](https://linkedin.com/in/darryl-munro)
- X: [@munrod10](https://x.com/munrod10)
- Email: darryl@darrylmunro.nz

---

*This is the markdown-only version of darrylmunro.me. Visit [darrylmunro.me](https://darrylmunro.me) for the full experience.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
