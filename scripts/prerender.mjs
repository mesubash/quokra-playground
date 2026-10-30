// Runs after `vite build`. Renders the public pages to real HTML so search engines, link
// previews and crawlers that don't run JavaScript see the content, then writes the SPA
// shell for every other route, robots.txt and sitemap.xml.
//
// dist/index.html        /       (pre-rendered)
// dist/docs/index.html   /docs   (pre-rendered)
// dist/spa.html          every other route: the empty app shell, noindex
import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "vite"

const dist = path.resolve("dist")
const ssrOut = path.resolve("node_modules/.prerender")
const OIDC_FILE = path.resolve("src/lib/oidc.ts")

await build({
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: ssrOut, emptyOutDir: true },
  plugins: [
    {
      // The agent login creates its client from `window` at import time; the public pages
      // never call it, so a stub keeps the build-time render out of browser-only code.
      name: "stub-oidc",
      enforce: "pre",
      load: (id) =>
        id === OIDC_FILE
          ? "export const oidc = {}; export const accessToken = () => Promise.reject(new Error('browser only'))"
          : null,
    },
  ],
})

// Newer Node versions ship an experimental localStorage; render as a first-time visitor instead
Object.defineProperty(globalThis, "localStorage", { value: undefined })

const { render, paths, headTags, SITE_URL } = await import(
  pathToFileURL(path.join(ssrOut, "entry-server.js")).href
)

const template = await fs.readFile(path.join(dist, "index.html"), "utf8")
const SEO = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
if (!SEO.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error("index.html is missing the seo markers or the empty #root")
}
const page = (head, html = "") =>
  template
    .replace(SEO, head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)

for (const route of paths) {
  const file = path.join(dist, route === "/" ? "" : route, "index.html")
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, page(headTags(route), await render(route)))
}
await fs.writeFile(path.join(dist, "spa.html"), page(headTags(null)))

const today = new Date().toISOString().slice(0, 10)
await fs.writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`
)
await fs.writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
)

await fs.rm(ssrOut, { recursive: true, force: true })
console.log(
  `Pre-rendered ${paths.join(", ")}; wrote spa.html, sitemap.xml, robots.txt`
)
