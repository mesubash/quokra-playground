import type { ComponentType } from "react"
import { Navigate, type RouteObject } from "react-router-dom"

/**
 * Every page is code-split. With the data router, a route's code is loaded
 * *before* the navigation commits: the current page stays on screen and the
 * root layout shows a progress bar until the next page is ready.
 */
function page(load: () => Promise<{ default: ComponentType }>) {
  return async () => ({ Component: (await load()).default })
}

export const routes: RouteObject[] = [
  // Use relative path "dashboard" instead of "/dashboard" for basename compatibility
  { path: "/", element: <Navigate to="dashboard" replace /> },
  { path: "/dashboard", lazy: page(() => import("@/app/dashboard/page")) },
  // Application Routes
  { path: "/users", lazy: page(() => import("@/app/users/page")) },
  { path: "/mail", lazy: page(() => import("@/app/mail/page")) },
  { path: "/chat", lazy: page(() => import("@/app/chat/page")) },
  // Settings Routes
  {
    path: "/settings/user",
    lazy: page(() => import("@/app/settings/user/page")),
  },
  {
    path: "/settings/account",
    lazy: page(() => import("@/app/settings/account/page")),
  },
  {
    path: "/settings/appearance",
    lazy: page(() => import("@/app/settings/appearance/page")),
  },
  {
    path: "/settings/notifications",
    lazy: page(() => import("@/app/settings/notifications/page")),
  },
  // Catch-all route for 404
  { path: "*", lazy: page(() => import("@/app/errors/not-found/page")) },
]
