// Search and share metadata. SITE_URL is the one place the public address lives: canonical
// links, the sitemap and share images are built from it.
export const SITE_URL = "https://quokra.subashsdhami.com.np"
export const SITE_NAME = "Quokra Playground"
export const OG_IMAGE = "/og-image.jpg"

export interface PageMeta {
  title: string
  description: string
  /** Public marketing page: indexed, in the sitemap, pre-rendered at build time. */
  index?: boolean
}

export const DEFAULT_DESCRIPTION =
  "Quokra is an embeddable support chat: a FAQ bot answers first, and your team takes over in the same conversation. Try both sides in this demo."

export const PUBLIC_PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Quokra: bot-first support chat with human handoff",
    description: DEFAULT_DESCRIPTION,
    index: true,
  },
  "/docs": {
    title: "Developer docs · Quokra",
    description:
      "Embed the Quokra chat and agent console with one script tag: integration snippets, SDK calls, REST and realtime API, theming and security.",
    index: true,
  },
}

// Demo screens behind sign-in: titled for the browser tab, kept out of search results
const APP_TITLES: Record<string, string> = {
  "/login": "Sign in",
  "/auth/callback": "Signing in",
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/mail": "Mail",
  "/chat": "Chat",
  "/support": "Support",
  "/settings/user": "User settings",
  "/settings/account": "Account settings",
  "/settings/appearance": "Appearance",
  "/settings/notifications": "Notifications",
}

export function metaFor(path: string): PageMeta {
  return (
    PUBLIC_PAGES[path] ?? {
      title: `${APP_TITLES[path] ?? "Page not found"} · ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    }
  )
}

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

/** Head tags for the static HTML files written at build time. */
export function headTags(path: string | null): string {
  // null: the app shell served for every non-public route
  const meta =
    path === null
      ? { title: SITE_NAME, description: DEFAULT_DESCRIPTION }
      : metaFor(path)
  const url = path === null ? null : `${SITE_URL}${path === "/" ? "/" : path}`
  const tags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<meta name="robots" content="${meta.index ? "index, follow" : "noindex"}" />`,
  ]
  if (url && meta.index) {
    tags.push(
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${escape(meta.title)}" />`,
      `<meta property="og:description" content="${escape(meta.description)}" />`,
      `<meta name="twitter:title" content="${escape(meta.title)}" />`,
      `<meta name="twitter:description" content="${escape(meta.description)}" />`
    )
  }
  if (path === "/") {
    // Only facts the page itself states: no ratings, prices or download counts
    const app = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Quokra",
      description: meta.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      image: `${SITE_URL}${OG_IMAGE}`,
    }
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(app).replace(/</g, "\\u003c")}</script>`
    )
  }
  return tags.join("\n    ")
}
