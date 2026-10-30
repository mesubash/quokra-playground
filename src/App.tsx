import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarConfigProvider } from "@/contexts/sidebar-context"
import { Toaster } from "@/components/ui/toast"
import { router } from "@/router"

function App() {
  return (
    <div
      className="font-sans antialiased"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <ThemeProvider defaultTheme="system" storageKey="quokra-playground-theme">
        <SidebarConfigProvider>
          <Toaster>
            <RouterProvider router={router} />
          </Toaster>
        </SidebarConfigProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
