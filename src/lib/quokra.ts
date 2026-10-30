// Quokra's sdk.js, loaded once, and the token calls to our (dev) backend.
// API: https://github.com/mesubash/quokra/blob/main/docs/EMBEDDING.md

export const QUOKRA_URL =
  import.meta.env.VITE_QUOKRA_URL ?? "http://localhost:8080"
export const QUOKRA_TENANT = import.meta.env.VITE_QUOKRA_TENANT ?? "demo"
export const QUOKRA_PK = import.meta.env.VITE_QUOKRA_PK ?? "pk_test_demo"

type Listener = (value?: unknown) => void

export type QuokraTheme = "light" | "dark" | "auto"

export interface QuokraSdk {
  chat: {
    init(options: {
      slug: string
      pk: string
      position?: "left" | "right"
      theme?: QuokraTheme
    }): void
    open(): void
    close(): void
    identify(token: string): void
    setTheme(theme: QuokraTheme): void
    on(event: string, fn: Listener): void
    destroy(): void
  }
  console: {
    mount(
      target: Element,
      options: {
        tenant: string
        getToken: () => Promise<string>
        height?: string
        theme?: QuokraTheme
      }
    ): void
    init(options: {
      mode: "bubble"
      tenant: string
      getToken: () => Promise<string>
      position?: "left" | "right"
      theme?: QuokraTheme
    }): void
    open(): void
    close(): void
    on(event: string, fn: Listener): void
    setTheme(theme: QuokraTheme): void
    unmount(): void
  }
}

declare global {
  interface Window {
    Quokra?: QuokraSdk
  }
}

let loading: Promise<QuokraSdk> | null = null

export function loadQuokra(): Promise<QuokraSdk> {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `${QUOKRA_URL}/sdk.js`
    script.async = true
    script.onload = () =>
      window.Quokra
        ? resolve(window.Quokra)
        : reject(new Error("sdk.js loaded without Quokra"))
    script.onerror = () => {
      loading = null
      reject(new Error(`Couldn't load ${script.src}. Is Quokra running?`))
    }
    document.head.appendChild(script)
  })
  return loading
}

async function token(path: string): Promise<string> {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
  })
  if (!response.ok) throw new Error(`${path}: ${response.status}`)
  return ((await response.json()) as { token: string }).token
}

// Identity token for the signed-in customer, signed by our backend.
export const identityToken = () => token("/api/quokra/identity")

// The dashboard's theme, in Quokra's terms ("system" is "auto").
export function quokraTheme(theme: "light" | "dark" | "system"): QuokraTheme {
  return theme === "system" ? "auto" : theme
}

// Access token for the signed-in agent.
export const agentToken = () => token("/api/quokra/agent-token")
