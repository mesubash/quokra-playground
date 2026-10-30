"use client"

import * as React from "react"
import {
  Headset,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Logo } from "@/components/logo"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { getUser } from "@/lib/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navGroups: [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Apps",
      items: [
        {
          title: "Users",
          url: "/users",
          icon: Users,
        },
        {
          title: "Mail",
          url: "/mail",
          icon: Mail,
        },
        {
          title: "Chat",
          url: "/chat",
          icon: MessageCircle,
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          title: "Settings",
          url: "#",
          icon: Settings,
          items: [
            {
              title: "User Settings",
              url: "/settings/user",
            },
            {
              title: "Account Settings",
              url: "/settings/account",
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
            },
          ],
        },
      ],
    },
  ],
}

// Agents also get the Support page with the Quokra console.
const supportGroup = {
  label: "Support",
  items: [{ title: "Support", url: "/support", icon: Headset }],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = getUser()
  const groups =
    user?.role === "agent"
      ? [data.navGroups[0], supportGroup, ...data.navGroups.slice(1)]
      : data.navGroups
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Logo size={24} className="text-current" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Quokra Playground</span>
                <span className="truncate text-xs">
                  {user?.role === "agent" ? "Support agent" : "Customer"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ ...user!, avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
