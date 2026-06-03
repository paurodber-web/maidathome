// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
const base = process.env.SITE_BASE?.trim() || '/';

export default defineConfig({
  base,
  build: {
    concurrency: 1,
  },
  redirects: {
    '/standard-cleaning': '/services/standard-cleaning',
    '/deep-cleaning': '/services/deep-cleaning',
    '/end-of-lease-cleaning': '/services/end-of-lease-cleaning',
    '/move-in-cleaning': '/services/move-in-cleaning',
    '/oven-cleaning': '/services/oven-cleaning',
  },
});
