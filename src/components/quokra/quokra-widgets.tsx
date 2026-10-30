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

  // The chat bubble stays for visitors and customers; it isn't rebuilt when someone signs in or out.
  const showChat = role !== "agent"
  useEffect(() => {
    if (!showChat) return
    let cancelled = false
    loadQuokra()
      .then((quokra) => {
        if (cancelled) return
        quokra.chat.init({
          slug: QUOKRA_TENANT,
          pk: QUOKRA_PK,
          theme: themeRef.current,
        })
        quokra.chat.on("identifyfailed", (code) =>
          console.warn("Quokra identify failed:", code)
        )
      })
      .catch((e) => console.warn(e))
    return () => {
      cancelled = true
      window.Quokra?.chat.destroy()
    }
  }, [showChat])

  // Signing in as a customer identifies the chat; signing out logs it out, so the
  // next person on this browser starts as a fresh guest.
  const customerEmail = role === "customer" ? user!.email : null
  const lastCustomer = useRef<string | null>(null)
  useEffect(() => {
    const previous = lastCustomer.current
    lastCustomer.current = customerEmail
    if (!showChat) return
    if (previous && previous !== customerEmail) {
      loadQuokra().then((quokra) => quokra.chat.logout())
    }
    if (!customerEmail) return
    let cancelled = false
    Promise.all([loadQuokra(), identityToken()])
      .then(([quokra, token]) => !cancelled && quokra.chat.identify(token))
      .catch((e) => console.warn("Couldn't identify the Quokra chat:", e))
    return () => {
      cancelled = true
    }
  }, [customerEmail, showChat])

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
