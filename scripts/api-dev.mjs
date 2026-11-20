// Dev-only bridge so `npm run dev` serves the real api/ handlers.
//
// Each request to /api/<name> dynamically imports api/<name>.mjs and calls its
// default export with the plain Node req/res objects, exactly as Vercel does.
// That keeps one handler implementation for local and deployed use, with no
// second server or TypeScript project.
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const API_PREFIX = '/api/'
const NAME_PATTERN = /^[A-Za-z0-9_-]+$/

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

/** @returns {import('vite').Plugin} */
export function apiDevPlugin() {
  return {
    name: 'ordacy-dev-api',
    apply: 'serve',

    // Vite only exposes VITE_* to the client. Server handlers need the
    // unprefixed names too (SUPABASE_SERVICE_ROLE_KEY), so load every key from
    // .env.local without overriding whatever the shell already set.
    config(_config, { mode }) {
      const loaded = loadEnv(mode, process.cwd(), '')
      for (const [key, value] of Object.entries(loaded)) {
        if (!(key in process.env)) process.env[key] = value
      }
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? '').split('?')[0]
        if (!path.startsWith(API_PREFIX)) {
          next()
          return
        }

        const name = path.slice(API_PREFIX.length)
        if (!NAME_PATTERN.test(name)) {
          sendJson(res, 404, { error: 'not found' })
          return
        }

        const file = join(process.cwd(), 'api', `${name}.mjs`)
        if (!existsSync(file)) {
          sendJson(res, 404, { error: 'not found' })
          return
        }

        try {
          // The query busts this handler's ESM cache, so handler edits take
          // effect on the next request. Shared api/_lib imports stay cached:
          // restart the dev server after editing those.
          const { mtimeMs } = statSync(file)
          const module = await import(
            `${pathToFileURL(file).href}?mtime=${mtimeMs}`
          )
          if (typeof module.default !== 'function') {
            throw new Error(`${file} has no default handler`)
          }
          await module.default(req, res)
        } catch (error) {
          console.error(`[api-dev] ${path} failed:`, error)
          if (!res.writableEnded) {
            if (!res.headersSent) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
            }
            res.end(JSON.stringify({ error: 'internal server error' }))
          }
        }
      })
    },
  }
}
