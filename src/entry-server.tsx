/* eslint-disable react-refresh/only-export-components -- build-time only, never hot-reloaded */
// Build-time renderer for the public pages (see scripts/prerender.mjs). Only / and /docs are
// rendered here; the browser-only parts (Quokra widgets, agent login) load on the client.
import { renderToString } from "react-dom/server"
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import LandingPage from "@/app/landing/page"
import DocsPage from "@/app/docs/page"
import { PUBLIC_PAGES, SITE_URL, headTags } from "@/config/seo"

const routes = [
  { path: "/", Component: LandingPage },
  { path: "/docs", Component: DocsPage },
]

export const paths = Object.keys(PUBLIC_PAGES)
export { SITE_URL, headTags }

export async function render(path: string) {
  const handler = createStaticHandler(routes)
  const context = await handler.query(new Request(`${SITE_URL}${path}`))
  if (context instanceof Response) throw new Error(`Cannot pre-render ${path}`)
  const router = createStaticRouter(handler.dataRoutes, context)

  // Same wrapper as App.tsx, so the page looks right before the script runs
  return renderToString(
    <div
      className="font-sans antialiased"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <ThemeProvider defaultTheme="system" storageKey="quokra-playground-theme">
        <StaticRouterProvider
          router={router}
          context={context}
          hydrate={false}
        />
      </ThemeProvider>
    </div>
  )
}
