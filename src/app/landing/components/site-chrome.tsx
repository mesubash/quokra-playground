import { Link, NavLink } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { getUser } from "@/lib/auth"
import { QUOKRA_REPO, docsUrl } from "../links"

/** Signed out: go to login. Signed in: straight back into the demo. */
export function DemoButton({ variant }: { variant?: "outline" }) {
  const user = getUser()
  const to = user
    ? user.role === "agent"
      ? "/support"
      : "/dashboard"
    : "/login"
  return (
    <Button
      size="lg"
      variant={variant}
      nativeButton={false}
      render={<Link to={to} />}
    >
      {user ? "Open the demo" : "Try the demo"}
      <ArrowRight data-icon="inline-end" />
    </Button>
  )
}

const navLink =
  "rounded-md px-3 py-2 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"

export function MarketingHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link
          to="/"
          className="mr-auto flex items-center gap-2 font-semibold whitespace-nowrap"
        >
          <Logo size={28} />
          Quokra Playground
        </Link>
        <NavLink to="/docs" className={navLink}>
          Docs
        </NavLink>
        <ModeToggle />
        <Button nativeButton={false} render={<Link to="/login" />}>
          Sign in
        </Button>
      </div>
    </header>
  )
}

const footerLinks = [
  { label: "Quokra on GitHub", href: QUOKRA_REPO },
  { label: "Embedding guide", href: docsUrl("EMBEDDING.md") },
  { label: "API reference", href: docsUrl("API.md") },
  {
    label: "Template credit",
    href: "https://github.com/shadcnstore/shadcn-dashboard-landing-template",
  },
]

export function MarketingFooter() {
  return (
    // Right padding leaves room for the Quokra chat bubble
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 pr-24 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>Quokra Playground · powered by Quokra</span>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap underline-offset-4 hover:text-foreground hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
