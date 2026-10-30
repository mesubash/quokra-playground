import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { RefreshCw, Unplug } from "lucide-react"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import {
  agentToken,
  loadQuokra,
  QUOKRA_TENANT,
  QUOKRA_URL,
  whenConsoleUnavailable,
} from "@/lib/quokra"

// The full Quokra agent console, inside the dashboard's own layout.
export default function SupportPage() {
  const container = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  // Bumped by "Try again" to load the console once more.
  const [attempt, setAttempt] = useState(0)
  // Set when coming from the drawer's "Open full view"; read once when the console mounts.
  const [params] = useSearchParams()
  const conversation = useRef(params.get("conversation"))

  useEffect(() => {
    let cancelled = false
    loadQuokra()
      .then((quokra) => {
        if (cancelled || !container.current) return
        whenConsoleUnavailable(quokra, () => !cancelled && setFailed(true))
        quokra.console.mount(container.current, {
          tenant: QUOKRA_TENANT,
          getToken: agentToken,
          height: "100%",
          conversation: conversation.current,
        })
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
      if (window.Quokra) whenConsoleUnavailable(window.Quokra, null)
      window.Quokra?.console.unmount()
    }
  }, [attempt])

  return (
    <BaseLayout
      title="Support"
      description="Customer conversations, answered live"
    >
      <div className="px-4 lg:px-6">
        {failed ? (
          <div
            role="alert"
            className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Unplug className="size-5 text-muted-foreground" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold">
              The support console can't be reached
            </h2>
            <p className="max-w-sm text-sm text-pretty text-muted-foreground">
              It may be restarting or offline. Your conversations are safe; try
              again in a moment.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFailed(false)
                setAttempt((n) => n + 1)
              }}
            >
              <RefreshCw data-icon="inline-start" />
              Try again
            </Button>
            {import.meta.env.DEV && (
              <p className="mt-2 max-w-sm text-xs text-muted-foreground">
                Developers: start Quokra (<code>docker compose up</code> in the
                Quokra repo) and check that it's at <code>{QUOKRA_URL}</code>.
              </p>
            )}
          </div>
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
