import type { ComponentType } from "react"
import { redirect, type RouteObject } from "react-router-dom"
import { getUser, requireAgent, requireAuth } from "@/lib/auth"

/**
 * Every page is code-split. With the data router, a route's code is loaded
 * *before* the navigation commits: the current page stays on screen and the
 * root layout shows a progress bar until the next page is ready.
 */
function page(load: () => Promise<{ default: ComponentType }>) {
  return async () => ({ Component: (await load()).default })
}

export const routes: RouteObject[] = [
  { path: "/", lazy: page(() => import("@/app/landing/page")) },
  {
    path: "/login",
    loader: () => (getUser() ? redirect("/dashboard") : null),
    lazy: page(() => import("@/app/login/page")),
  },
  // Everything below needs a (mock) session
  {
    loader: requireAuth,
    children: [
      { path: "/dashboard", lazy: page(() => import("@/app/dashboard/page")) },
      { path: "/users", lazy: page(() => import("@/app/users/page")) },
      { path: "/mail", lazy: page(() => import("@/app/mail/page")) },
      { path: "/chat", lazy: page(() => import("@/app/chat/page")) },
      {
        path: "/support",
        loader: requireAgent,
        lazy: page(() => import("@/app/support/page")),
      },
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
    ],
  },
  // Catch-all route for 404
  { path: "*", lazy: page(() => import("@/app/errors/not-found/page")) },
]
