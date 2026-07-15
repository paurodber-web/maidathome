import { defineConfig } from 'astro/config';

const base = process.env.ASTRO_BASE ?? '/';

export default defineConfig({
  site: 'https://paurodber-web.github.io',
  // Local development is served from /. The GitHub Pages build explicitly
  // sets ASTRO_BASE=/maidathome through the build:github-pages script.
  base,
  build: {
    format: 'directory',
  },
  image: {
    domains: ['images.unsplash.com', 'maidathome.com.au'],
    layout: 'full-width',
    responsiveStyles: true,
  },
});
