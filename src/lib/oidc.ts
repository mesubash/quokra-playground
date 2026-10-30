import { UserManager, WebStorageStateStore } from "oidc-client-ts"
import { AGENT_LOGIN } from "@/lib/agent-login"
import { clearSession } from "@/lib/auth"

// Real agent login: the identity provider's own sign-in page, with PKCE. Locally that's the Keycloak
// that Quokra's compose.yaml starts; point VITE_OIDC_AUTHORITY at any other OIDC provider to use it.
// Tokens are kept in localStorage so every tab of the dashboard shares the login, and refreshed
// in the background before they expire.
export const oidc = new UserManager({
  authority:
    import.meta.env.VITE_OIDC_AUTHORITY ??
    "http://localhost:8180/realms/quokra",
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID ?? "quokra-dashboard",
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: `${window.location.origin}/login`,
  scope: "openid profile email",
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
})

const DEMO_TOKEN = "quokra-playground-demo-token"

interface DemoAgent {
  sub: string
  name: string
}

// Demo sign-in: Quokra signs a token for a demo agent. Who it's for is kept, so it can be renewed.
export async function demoSignIn(agent: DemoAgent): Promise<string> {
  const quokra = import.meta.env.VITE_QUOKRA_URL ?? "http://localhost:8080"
  const response = await fetch(`${quokra}/dev/agent-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sub: agent.sub, name: agent.name, admin: true }),
  })
  if (!response.ok) throw new Error(`Demo sign-in failed: ${response.status}`)
  const { accessToken } = (await response.json()) as { accessToken: string }
  localStorage.setItem(DEMO_TOKEN, JSON.stringify({ agent, accessToken }))
  return accessToken
}

// The console asks for a token when it starts, before one expires, and after one is refused. A free demo
// host restarts when it wakes up, which makes earlier tokens useless, so every request gets a fresh one.
async function demoAccessToken(): Promise<string | null> {
  try {
    const saved = JSON.parse(localStorage.getItem(DEMO_TOKEN) ?? "null") as { agent: DemoAgent } | null
    return saved ? await demoSignIn(saved.agent) : null
  } catch {
    return null
  }
}

// The agent's current access token, refreshed first if it has expired. If the login session is gone
// (expired, revoked, or the provider was reset), the agent signs in again and comes back here.
export async function accessToken(): Promise<string> {
  if (AGENT_LOGIN === "demo") {
    const token = await demoAccessToken()
    if (token) return token
    clearSession()
    window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`)
    return new Promise<string>(() => {})
  }
  try {
    let user = await oidc.getUser()
    if (!user || user.expired) user = await oidc.signinSilent()
    if (user) return user.access_token
  } catch {
    // Falls through to signing in again.
  }
  await oidc.removeUser()
  clearSession()
  const here = window.location.pathname + window.location.search
  window.location.assign(`/login?next=${encodeURIComponent(here)}`)
  // The page is leaving; never resolve.
  return new Promise<string>(() => {})
}
