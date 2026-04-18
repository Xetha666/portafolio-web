import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bryansantillan.dev',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),

  output: 'server',

  session: {
    driver: {
      entrypoint: 'unstorage/drivers/null'
    }
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      }
    }
  },

  integrations: [sitemap()]
});