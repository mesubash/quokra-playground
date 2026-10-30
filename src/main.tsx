import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { router } from "./router"

const container = document.getElementById("root")!
const start = () =>
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  )

// Pre-rendered pages (/ and /docs) already show their content: keep it on screen until the
// router has loaded the page's code, instead of flashing the loading spinner in between.
if (container.hasChildNodes() && !router.state.initialized) {
  const unsubscribe = router.subscribe((state) => {
    if (!state.initialized) return
    unsubscribe()
    start()
  })
} else {
  start()
}
