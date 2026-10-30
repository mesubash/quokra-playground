import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { signIn } from "@/lib/auth"
import type { User } from "oidc-client-ts"
import { oidc } from "@/lib/oidc"

// The code from the identity provider can be exchanged only once. React runs effects twice in
// development, and a second exchange makes the provider revoke the whole login (Keycloak: "Code already
// used"), after which refreshing the token fails. So the exchange is shared, not repeated.
let finishing: Promise<User> | null = null

// Where the identity provider sends the agent back after signing in.
export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    finishing ??= oidc.signinRedirectCallback()
    finishing
      .then((user) => {
        signIn({
          name: user.profile.name ?? user.profile.preferred_username ?? "Agent",
          email: user.profile.email ?? "",
          role: "agent",
        })
        const next = (user.state as { next?: string } | undefined)?.next
        // Only follow same-app paths, never "//host" or absolute URLs
        navigate(
          next?.startsWith("/") && !next.startsWith("//") ? next : "/support",
          { replace: true }
        )
      })
      .catch((e: Error) => setError(e.message))
  }, [navigate])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      {error ? (
        <>
          <p className="text-muted-foreground">
            Signing in didn't work: {error}
          </p>
          <Link to="/login" className="underline underline-offset-4">
            Back to sign in
          </Link>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  )
}
