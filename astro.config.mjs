import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Для GitHub Pages: https://dmitrylelee.github.io/justice/
// Если сайт переедет на свой домен, уберите base и поменяйте site.
export default defineConfig({
  site: 'https://dmitrylelee.github.io',
  base: '/justice',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
