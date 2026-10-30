import { redirect, type LoaderFunctionArgs } from "react-router-dom"

// Mock session for playground use: any email/password signs in, and the
// "session" is just the email in localStorage. Not real authentication.
const KEY = "quokra-playground-session"

export interface SessionUser {
  name: string
  email: string
}

export function getUser(): SessionUser | null {
  try {
    const email = localStorage.getItem(KEY)
    return email ? { name: email.split("@")[0], email } : null
  } catch {
    return null
  }
}

export function signIn(email: string) {
  localStorage.setItem(KEY, email)
}

export function signOut() {
  localStorage.removeItem(KEY)
}

/** Route loader: send signed-out visitors to /login, then back here after. */
export function requireAuth({ request }: LoaderFunctionArgs) {
  if (getUser()) return null
  const { pathname, search } = new URL(request.url)
  return redirect(`/login?next=${encodeURIComponent(pathname + search)}`)
}
