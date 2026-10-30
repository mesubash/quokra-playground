import { createHmac } from "node:crypto"
import type { IncomingMessage, ServerResponse } from "node:http"
import type { Connect, Plugin } from "vite"

// A tiny stand-in for the playground's backend, for the one thing Quokra needs from a backend:
//   POST /api/quokra/identity  a short-lived identity token for the signed-in customer,
//                              signed with the tenant secret key (which never reaches the browser).
// Agents don't need it: they sign in at the identity provider and the console uses that token.
// It runs inside the Vite dev/preview server, so there's nothing extra to start.

interface SessionUser {
  name: string
  email: string
  role: "customer" | "agent"
}

const base64url = (data: string | Buffer) =>
  Buffer.from(data).toString("base64url")

function signIdentityToken(user: SessionUser, secret: string) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = base64url(
    JSON.stringify({
      sub: user.email,
      name: user.name,
      email: user.email,
      iat: now,
      exp: now + 300,
    })
  )
  const signature = createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64url")
  return `${header}.${payload}.${signature}`
}

function sessionFrom(req: IncomingMessage): SessionUser | null {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("playground_session="))
  if (!cookie) return null
  try {
    return JSON.parse(
      decodeURIComponent(cookie.slice("playground_session=".length))
    )
  } catch {
    return null
  }
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Cache-Control", "no-store")
  res.end(JSON.stringify(body))
}

export function quokraApi(env: Record<string, string>): Plugin {
  const secret = env.QUOKRA_SECRET_KEY

  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    if (req.method !== "POST" || !req.url?.startsWith("/api/quokra/"))
      return next()
    const user = sessionFrom(req)
    if (!user) return send(res, 401, { error: "Not signed in" })

    if (req.url === "/api/quokra/identity") {
      if (user.role !== "customer")
        return send(res, 403, { error: "Only customers are identified" })
      if (!secret)
        return send(res, 500, { error: "Set QUOKRA_SECRET_KEY in .env.local" })
      return send(res, 200, { token: signIdentityToken(user, secret) })
    }

    return next()
  }

  return {
    name: "quokra-api",
    configureServer: (server) => void server.middlewares.use(handler),
    configurePreviewServer: (server) => void server.middlewares.use(handler),
  }
}
