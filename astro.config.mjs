import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://paurodber-web.github.io',
  base: '/maidathome',
  build: {
    format: 'directory',
  },
  image: {
    domains: ['images.unsplash.com', 'maidathome.com.au'],
    layout: 'full-width',
    responsiveStyles: true,
  },
});
