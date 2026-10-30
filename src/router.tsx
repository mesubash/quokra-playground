import { createBrowserRouter } from "react-router-dom"
import { RootFallback, RootLayout } from "@/components/router/root-layout"
import { routes } from "@/config/routes"

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    HydrateFallback: RootFallback,
    children: routes,
  },
])
