import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { BaseLayout } from "@/components/layouts/base-layout"
import { useTheme } from "@/hooks/use-theme"
import {
  agentToken,
  loadQuokra,
  QUOKRA_TENANT,
  quokraTheme,
} from "@/lib/quokra"

// The full Quokra agent console, inside the dashboard's own layout.
export default function SupportPage() {
  const container = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  // Set when coming from the drawer's "Open full view"; read once when the console mounts.
  const [params] = useSearchParams()
  const conversation = useRef(params.get("conversation"))
  const theme = quokraTheme(useTheme().theme)
  const themeRef = useRef(theme)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    let cancelled = false
    loadQuokra()
      .then((quokra) => {
        if (cancelled || !container.current) return
        quokra.console.mount(container.current, {
          tenant: QUOKRA_TENANT,
          getToken: agentToken,
          height: "100%",
          theme: themeRef.current,
          conversation: conversation.current,
        })
      })
      .catch((e: Error) => setError(e.message))
    return () => {
      cancelled = true
      window.Quokra?.console.unmount()
    }
  }, [])

  return (
    <BaseLayout
      title="Support"
      description="Customer conversations, answered live"
    >
      <div className="px-4 lg:px-6">
        {error ? (
          <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            {error}
          </p>
        ) : (
          <div
            ref={container}
            className="h-[calc(100svh-12rem)] min-h-[480px] overflow-hidden rounded-xl border bg-background"
          />
        )}
      </div>
    </BaseLayout>
  )
}
