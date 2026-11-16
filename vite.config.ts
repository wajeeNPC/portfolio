import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Writes robots.txt and sitemap.xml into the build, using VITE_SITE_URL from .env
 * (search engines need full addresses there). Without the address, only robots.txt is written.
 */
function seoFiles(siteUrl: string): Plugin {
  const url = siteUrl.replace(/\/+$/, '')
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', ...(url ? ['', `Sitemap: ${url}/sitemap.xml`] : [])].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots + '\n' })
      if (!url) {
        this.warn('VITE_SITE_URL is empty in .env: skipped sitemap.xml and link previews will lack a full address.')
        return
      }
      const today = new Date().toISOString().slice(0, 10)
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
`
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), seoFiles(env.VITE_SITE_URL ?? '')],
  }
})
