// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL can override the domain used for the sitemap and link previews.
export default defineConfig({
  site: process.env.SITE_URL || 'https://nokitlab.com',
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
});
