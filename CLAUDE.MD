# Instructions for Claude

This document contains important instructions and notes for Claude when working on this project.

## CRITICAL GUIDELINES

### NEVER CREATE BLOG POSTS WITHOUT CONSENT

- **NEVER CREATE BLOG POSTS WITHOUT EXPLICIT CONSENT** from Darryl
- Do not write or propose new blog content unless specifically requested
- Only help with editing or fixing existing posts when asked

### ALWAYS USE BUN

- **ALWAYS USE `bun` INSTEAD OF `npm`** — this project uses bun as its package manager and runtime
- Use `bun run build`, `bun install`, `bun run dev`, etc.
- Never use `npm run`, `npm install`, etc.

### ALWAYS USE LATEST DEPENDENCIES

- **NEVER DOWNGRADE DEPENDENCIES** - Always use the latest stable versions
- **ALWAYS USE TOOLING TO CHECK VERSIONS** - Never guess or assume versions
- Run `bun outdated` to see what packages need updating
- When fixing dependency issues, always upgrade to the latest compatible versions

### IMPORTANT: Development Server Limitation

- **DO NOT run `bun run dev`** in agent mode - this will create an endless loop
- Instead, use `bun run build` to verify your changes

## Development Process

### Testing Changes

```bash
# Build the project (preferred in agent mode)
bun run build

# Preview the build (only when specifically requested)
bun run preview
```

### Project Structure

- `/src/content/blog/` - Blog posts in markdown format
- `/src/data/homepage.ts` - Editable homepage data (work cards, now section)
- `/src/pages/` - Page templates and routing
- `/src/components/` - Reusable UI components
- `/src/layouts/` - Page layouts and templates
- `/src/styles/` - CSS styles including Tailwind customizations
- `/src/utils/` - Utility functions (including Substack RSS fetcher)

### Key Data Files

- `src/data/homepage.ts` — Work cards and Now section content
- `src/consts.ts` — Site config, nav links, social links
- `src/constants.ts` — Social media links for components
- `src/pages/services.astro` — Service offerings (editable inline)
- `src/pages/contact.astro` — Contact form (wire to CRM via action attribute)

## Tech Stack

- **Astro** (latest version) - Main framework
- **TailwindCSS 4** - Styling
- **React** - Interactive components
- **MDX** - Enhanced markdown
- **Bun** - Package manager and runtime
