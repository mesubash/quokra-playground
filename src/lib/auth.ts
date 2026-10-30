import { redirect, type LoaderFunctionArgs } from "react-router-dom"

// Mock session for playground use: not real authentication. Customers sign in with any email;
// agents pick one of the demo agents that are set up in Quokra's dev data.
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

export const DEMO_AGENTS: SessionUser[] = [
  { name: "Sam", email: "sam@playground.test", role: "agent" },
  { name: "Alex", email: "alex@playground.test", role: "agent" },
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
