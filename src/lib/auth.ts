import { redirect, type LoaderFunctionArgs } from "react-router-dom"
import { AGENT_LOGIN } from "@/lib/agent-login"
import { oidc } from "@/lib/oidc"

// Playground session. Customers use a mock login (any email). Agents sign in for real through the
// identity provider (src/lib/oidc.ts); this keeps their name and role for the UI.
const KEY = "quokra-playground-session"
// The dev backend (dev/quokra-api.ts) reads the session from this cookie, the way a real
// backend would read its own session cookie.
const COOKIE = "playground_session"

export type Role = "customer" | "agent"

export interface SessionUser {
  name: string
  email: string
  role: Role
}

// The agents in the local Keycloak realm (Quokra's server/keycloak/quokra-realm.json).
// Dev only: their passwords are public.
// sub: their id there, which the demo sign-in uses too, so they're the demo company's agents either way.
export const DEMO_AGENTS = [
  { name: "Sam Lee", username: "sam", password: "sam", sub: "0b9e8a3c-0001-4000-8000-00000000a001" },
  { name: "Alex Kim", username: "alex", password: "alex", sub: "0b9e8a3c-0001-4000-8000-00000000a002" },
]

export function getUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const user = JSON.parse(raw) as SessionUser
    return user.email && (user.role === "customer" || user.role === "agent")
      ? user
      : null
  } catch {
    return null
  }
}

export function signIn(user: SessionUser) {
  localStorage.setItem(KEY, JSON.stringify(user))
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/; SameSite=Lax`
}

export function signOut() {
  // Agents also end their session at the identity provider, which then returns to /login.
  // With the demo sign-in there's none: forgetting the session is enough.
  if (getUser()?.role === "agent" && AGENT_LOGIN === "oidc") {
    clearSession()
    void oidc.signoutRedirect().catch(() => oidc.removeUser())
    return
  }
  clearSession()
}

export function clearSession() {
  localStorage.removeItem(KEY)
  document.cookie = `${COOKIE}=; path=/; max-age=0`
}

export function customerFromEmail(email: string): SessionUser {
  const local = email.split("@")[0]
  const name = local.charAt(0).toUpperCase() + local.slice(1)
  return { name, email, role: "customer" }
}

/** Route loader: send signed-out visitors to /login, then back here after. */
export function requireAuth({ request }: LoaderFunctionArgs) {
  if (getUser()) return null
  const { pathname, search } = new URL(request.url)
  return redirect(`/login?next=${encodeURIComponent(pathname + search)}`)
}

/** Route loader for agent-only pages. */
export function requireAgent(args: LoaderFunctionArgs) {
  const user = getUser()
  if (!user) return requireAuth(args)
  return user.role === "agent" ? null : redirect("/dashboard")
}
