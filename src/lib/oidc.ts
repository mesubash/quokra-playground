import { UserManager, WebStorageStateStore } from "oidc-client-ts"
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

// The agent's current access token, refreshed first if it has expired. If the login session is gone
// (expired, revoked, or the provider was reset), the agent signs in again and comes back here.
export async function accessToken(): Promise<string> {
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
