import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

/** A code block with a copy button. The button is always visible, not hover-only. */
export function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
    } catch {
      // Clipboard blocked (insecure origin or permission): selecting by hand still works
    }
  }

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg border bg-muted p-4 pr-14 text-sm">
        <code>{children}</code>
      </pre>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2.5 right-2.5 bg-muted text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  )
}
