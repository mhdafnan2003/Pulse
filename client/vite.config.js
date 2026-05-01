import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const clientDir = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.resolve(clientDir, '../assets')

function getContentType(filePath) {
  if (filePath.endsWith('.svg')) return 'image/svg+xml'
  if (filePath.endsWith('.png')) return 'image/png'
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg'
  if (filePath.endsWith('.gif')) return 'image/gif'
  if (filePath.endsWith('.webp')) return 'image/webp'
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8'
  if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) return 'text/javascript; charset=utf-8'
  if (filePath.endsWith('.woff2')) return 'font/woff2'
  if (filePath.endsWith('.woff')) return 'font/woff'
  if (filePath.endsWith('.ttf')) return 'font/ttf'
  if (filePath.endsWith('.eot')) return 'application/vnd.ms-fontobject'
  return 'application/octet-stream'
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-local-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const requestPath = decodeURIComponent((req.url || '').split('?')[0] || '/')

          if (!requestPath.startsWith('/assets/')) {
            next()
            return
          }

          const relativePath = requestPath.replace(/^\/assets\//, '')
          const filePath = path.join(assetsDir, relativePath)

          if (!filePath.startsWith(assetsDir)) {
            next()
            return
          }

          fs.stat(filePath, (error, stats) => {
            if (error || !stats.isFile()) {
              next()
              return
            }

            res.statusCode = 200
            res.setHeader('Content-Type', getContentType(filePath))
            fs.createReadStream(filePath).pipe(res)
          })
        })
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
