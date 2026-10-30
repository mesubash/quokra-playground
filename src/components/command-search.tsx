"use client"

import { useNavigate } from "react-router-dom"
import {
  Search,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Settings,
  User,
  Users,
  Bell,
  Palette,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"

interface SearchItem {
  title: string
  url: string
  group: string
  icon?: LucideIcon
}

interface CommandSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const navigate = useNavigate()

  const searchItems: SearchItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      group: "Overview",
      icon: LayoutDashboard,
    },

    // Apps
    { title: "Users", url: "/users", group: "Apps", icon: Users },
    { title: "Mail", url: "/mail", group: "Apps", icon: Mail },
    { title: "Chat", url: "/chat", group: "Apps", icon: MessageCircle },

    // Settings
    {
      title: "User Settings",
      url: "/settings/user",
      group: "Settings",
      icon: User,
    },
    {
      title: "Account Settings",
      url: "/settings/account",
      group: "Settings",
      icon: Settings,
    },
    {
      title: "Appearance",
      url: "/settings/appearance",
      group: "Settings",
      icon: Palette,
    },
    {
      title: "Notifications",
      url: "/settings/notifications",
      group: "Settings",
      icon: Bell,
    },
  ]

  const groupedItems = searchItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = []
      }
      acc[item.group].push(item)
      return acc
    },
    {} as Record<string, SearchItem[]>
  )

  const handleSelect = (url: string) => {
    navigate(url)
    onOpenChange(false)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command Search"
      description="Search pages and settings"
      className="sm:max-w-[640px]"
    >
      <Command>
        <CommandInput placeholder="What do you need?" autoFocus />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(groupedItems).map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <CommandItem
                    key={item.url}
                    value={item.title}
                    onSelect={() => handleSelect(item.url)}
                  >
                    {Icon && <Icon />}
                    {item.title}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="relative w-full justify-start font-normal text-muted-foreground sm:pr-12 md:w-36 lg:w-56"
    >
      <Search data-icon="inline-start" />
      Search...
      <Kbd className="absolute top-1/2 right-1.5 hidden -translate-y-1/2 sm:inline-flex">
        ⌘K
      </Kbd>
    </Button>
  )
}
