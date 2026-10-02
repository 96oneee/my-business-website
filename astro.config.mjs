// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL in Netlify (Site settings → Environment variables) once the domain is known.
export default defineConfig({
  site: process.env.SITE_URL || process.env.URL || 'https://nokitlab.netlify.app',
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
});
