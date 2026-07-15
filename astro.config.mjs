import { defineConfig } from 'astro/config';

export default defineConfig({
  build: {
    format: 'directory',
  },
  image: {
    domains: ['images.unsplash.com', 'maidathome.com.au'],
    layout: 'full-width',
    responsiveStyles: true,
  },
});
