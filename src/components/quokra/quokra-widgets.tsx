import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getUser } from "@/lib/auth"
import { useTheme } from "@/hooks/use-theme"
import {
  agentToken,
  identityToken,
  loadQuokra,
  QUOKRA_PK,
  QUOKRA_TENANT,
  quokraTheme,
} from "@/lib/quokra"

// Puts the right Quokra widget on every page:
//   visitors and customers: the chat bubble (customers are identified)
//   agents: the console bubble, except on /support where the full console is mounted
export function QuokraWidgets() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = getUser()
  const role = user?.role ?? "visitor"
  const onSupportPage = pathname.startsWith("/support")
  // Read when a widget starts; later changes go through setTheme below.
  const theme = quokraTheme(useTheme().theme)
  const themeRef = useRef(theme)

  useEffect(() => {
    themeRef.current = theme
    window.Quokra?.chat.setTheme(theme)
    window.Quokra?.console.setTheme(theme)
  }, [theme])

  useEffect(() => {
    if (role === "agent") return
    let cancelled = false
    loadQuokra()
      .then((quokra) => {
        if (cancelled) return
        quokra.chat.init({
          slug: QUOKRA_TENANT,
          pk: QUOKRA_PK,
          theme: themeRef.current,
        })
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
            theme: themeRef.current,
            // "Open full view" in the drawer goes to the Support page, same conversation.
            fullView: (id) =>
              navigate(id ? `/support?conversation=${id}` : "/support"),
          })
      )
      .catch((e) => console.warn(e))
    return () => {
      cancelled = true
      window.Quokra?.console.unmount()
    }
  }, [role, onSupportPage, user?.email, navigate])

  return null
}
