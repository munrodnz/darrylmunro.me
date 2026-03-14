# Darryl Munro — Personal Website

Personal website and blog built with [Astro](https://astro.build) and deployed on [Vercel](https://vercel.com).

## Project Structure

```text
├── public/               # Static assets (images, fonts, favicon)
├── src/
│   ├── components/       # Reusable UI components
│   ├── content/blog/     # Blog posts in Markdown format
│   ├── data/             # Editable homepage data (work cards, now section)
│   ├── layouts/          # Page layouts and templates
│   ├── pages/            # Routes and pages
│   ├── styles/           # Global styles and CSS
│   └── utils/            # Utility functions
├── astro.config.mjs      # Astro configuration
├── vercel.json           # Vercel deployment configuration
└── package.json          # Project dependencies and scripts
```

## Commands

| Command            | Action                                      |
| :----------------- | :------------------------------------------ |
| `bun install`      | Installs dependencies                       |
| `bun run dev`      | Starts local dev server at `localhost:4321`  |
| `bun run build`    | Build the production site to `./dist/`      |
| `bun run preview`  | Preview the build locally, before deploying |

## License

- **Blog Posts & Documentation**: [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
- **Code**: [MIT License](LICENSE)

## Credits

Built on the [AstroPaper theme](https://astro-paper.pages.dev/) by [Sat Naing](https://github.com/satnaing).
