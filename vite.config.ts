import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

/** Domyślny adres produkcyjny; własną domenę ustawiasz zmienną SITE_URL (np. w .env) albo tutaj. */
const DEFAULT_SITE_URL = 'https://northline-atelier.matyszczak24.workers.dev'

/** Podmienia __SITE_URL__ w index.html (canonical, Open Graph, Twitter Card). */
const siteUrl = (base: string): Plugin => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.split('__SITE_URL__').join(base),
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const base = (env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')
  return {
    plugins: [react(), cloudflare(), siteUrl(base)],
    build: { target: 'es2020', chunkSizeWarningLimit: 700 },
  }
})
