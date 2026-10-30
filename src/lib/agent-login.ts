// How agents sign in: "oidc" (the identity provider in oidc.ts) or "demo" (Quokra's own demo sign-in, for a
// public demo without an identity provider; see Quokra's docs/guides/09-free-demo.md).
export const AGENT_LOGIN: "oidc" | "demo" =
  import.meta.env.VITE_AGENT_LOGIN === "demo" ? "demo" : "oidc"
