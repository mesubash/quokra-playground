import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { getUser } from "@/lib/auth"
import {
  agentToken,
  identityToken,
  loadQuokra,
  QUOKRA_PK,
  QUOKRA_TENANT,
} from "@/lib/quokra"

// Puts the right Quokra widget on every page:
//   visitors and customers: the chat bubble (customers are identified)
//   agents: the console bubble, except on /support where the full console is mounted
export function QuokraWidgets() {
  const { pathname } = useLocation()
  const user = getUser()
  const role = user?.role ?? "visitor"
  const onSupportPage = pathname.startsWith("/support")

  useEffect(() => {
    if (role === "agent") return
    let cancelled = false
    loadQuokra()
      .then((quokra) => {
        if (cancelled) return
        quokra.chat.init({ slug: QUOKRA_TENANT, pk: QUOKRA_PK })
        if (role === "customer") {
          quokra.chat.on("identifyfailed", (code) =>
            console.warn("Quokra identify failed:", code)
          )
          identityToken()
            .then((token) => !cancelled && quokra.chat.identify(token))
            .catch((e) =>
              console.warn("Couldn't get a Quokra identity token:", e)
            )
        }
      })
      .catch((e) => console.warn(e))
    return () => {
      cancelled = true
      window.Quokra?.chat.destroy()
    }
  }, [role, user?.email])

  useEffect(() => {
    if (role !== "agent" || onSupportPage) return
    let cancelled = false
    loadQuokra()
      .then(
        (quokra) =>
          !cancelled &&
          quokra.console.init({
            mode: "bubble",
            tenant: QUOKRA_TENANT,
            getToken: agentToken,
          })
      )
      .catch((e) => console.warn(e))
    return () => {
      cancelled = true
      window.Quokra?.console.unmount()
    }
  }, [role, onSupportPage, user?.email])

  return null
}
