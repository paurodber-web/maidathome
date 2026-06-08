# Maid At Home

Astro static website for Maid At Home, focused on fast loading, clean service pages, and strong Lighthouse performance.

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

`npm run build`:

- Builds the production site into `dist/` for GitHub Pages.

## Project Structure

- `src/pages/` contains the site routes.
- `src/components/` contains reusable Astro components.
- `src/data/` contains shared content/data used by pages.
- `public/` contains static assets served from the site root.

The production build is generated into `dist/`, which is intentionally ignored by Git.
GitHub Pages is deployed from the generated `dist/` artifact in CI, so the repo does not need to keep a mirrored HTML snapshot at the root.
