import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { SITE_URL, metaFor } from "@/config/seo"

function setTag(selector: string, attr: string, value: string | null) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (value === null) return el?.remove()
  if (!el) {
    const [tag, key, name] = selector
      .match(/^(\w+)\[(\w+)="([^"]+)"\]$/)!
      .slice(1)
    el = document.createElement(tag)
    el.setAttribute(key, name)
    document.head.append(el)
  }
  el.setAttribute(attr, value)
}

/** Keeps the title, description, robots and canonical in step with client-side navigation. */
export function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = metaFor(pathname)
    const url = meta.index ? `${SITE_URL}${pathname}` : null
    document.title = meta.title
    setTag('meta[name="description"]', "content", meta.description)
    setTag(
      'meta[name="robots"]',
      "content",
      meta.index ? "index, follow" : "noindex"
    )
    setTag('link[rel="canonical"]', "href", url)
    setTag('meta[property="og:url"]', "content", url)
    setTag('meta[property="og:title"]', "content", meta.title)
    setTag('meta[property="og:description"]', "content", meta.description)
  }, [pathname])

  return null
}
