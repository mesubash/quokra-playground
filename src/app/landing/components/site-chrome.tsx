import { Link, NavLink } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { getUser } from "@/lib/auth"
import {
  PLAYGROUND_REPO,
  QUOKRA_REPO,
  TEMPLATE_REPO,
  docsUrl,
  repoFile,
} from "../links"

export function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

/** Where the demo starts for whoever is signed in, or the login page. */
function demoHome() {
  const user = getUser()
  return user ? (user.role === "agent" ? "/support" : "/dashboard") : "/login"
}

/** Signed out: go to login. Signed in: straight back into the demo. */
export function DemoButton() {
  const user = getUser()
  const to = demoHome()
  return (
    <Button size="lg" nativeButton={false} render={<Link to={to} />}>
      {user ? "Open the demo" : "Try the demo"}
      <ArrowRight data-icon="inline-end" />
    </Button>
  )
}

export function GitHubButton() {
  return (
    <Button
      size="lg"
      variant="outline"
      nativeButton={false}
      render={
        <a href={QUOKRA_REPO} target="_blank" rel="noopener noreferrer" />
      }
    >
      <GitHubMark className="size-4" />
      View on GitHub
    </Button>
  )
}

const navItems = [
  { label: "Product", to: "/#product" },
  { label: "Roadmap", to: "/#roadmap" },
]

// Underline grows left to right on hover and focus, and stays on the current page
const navLink =
  "relative hidden px-3 py-2 text-sm whitespace-nowrap text-muted-foreground rounded-md transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:text-foreground sm:inline-flex after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=page]:after:scale-x-100 motion-reduce:after:transition-none"

export function MarketingHeader() {
  return (
    <>
      <div className="border-b bg-muted/60 text-sm">
        <p className="mx-auto max-w-6xl px-4 py-2 text-muted-foreground">
          Quokra 2.0 is out: images, saved replies, opening hours, email alerts
          and more.{" "}
          <Link
            to="/#roadmap"
            className="font-medium whitespace-nowrap text-foreground underline-offset-4 hover:underline"
          >
            See what's next
          </Link>
        </p>
      </div>
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-1 px-4">
          <Link
            to="/"
            className="mr-auto flex items-center gap-2 font-semibold whitespace-nowrap"
          >
            <Logo size={28} />
            Quokra
            <span className="hidden font-normal text-muted-foreground sm:inline">
              Playground
            </span>
          </Link>
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className={navLink}>
              {item.label}
            </Link>
          ))}
          <NavLink to="/docs" className={navLink}>
            Docs
          </NavLink>
          <a
            href={QUOKRA_REPO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Quokra on GitHub"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          >
            <GitHubMark className="size-5" />
          </a>
          <ModeToggle />
          <Button
            className="ml-1"
            nativeButton={false}
            render={<Link to={demoHome()} />}
          >
            {getUser() ? "Open dashboard" : "Sign in"}
          </Button>
        </div>
      </header>
    </>
  )
}

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#product" },
      { label: "Roadmap", href: "/#roadmap" },
      { label: "Try the demo", href: "/login" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Developer docs", href: "/docs" },
      { label: "Embedding guide", href: docsUrl("EMBEDDING.md") },
      { label: "Guides", href: docsUrl("guides/README.md") },
      { label: "API reference", href: docsUrl("API.md") },
      { label: "Architecture", href: docsUrl("ARCHITECTURE.md") },
      { label: "Run it locally", href: docsUrl("DEVELOPMENT.md") },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Quokra on GitHub", href: QUOKRA_REPO },
      { label: "Plan", href: docsUrl("PLAN.md") },
      { label: "Changelog", href: docsUrl("CHANGELOG.md") },
      { label: "Licence (AGPL-3.0)", href: repoFile("LICENSE") },
      { label: "Report an issue", href: `${QUOKRA_REPO}/issues` },
      { label: "Playground source", href: PLAYGROUND_REPO },
      {
        label: "Third-party notices",
        href: repoFile("THIRD_PARTY_NOTICES.md"),
      },
    ],
  },
]

const footerLink =
  "underline-offset-4 whitespace-nowrap hover:text-foreground hover:underline"

export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="max-w-xs">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Logo size={28} />
            Quokra
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Support chat for your site and dashboard: a bot answers first, your
            team takes over in the same conversation.
          </p>
        </div>
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-medium">{col.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerLink}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className={footerLink}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      {/* Right padding leaves room for the Quokra chat bubble */}
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-5 pr-24 text-xs text-muted-foreground">
          Playground code is MIT licensed. Based on{" "}
          <a
            href={TEMPLATE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            shadcn-dashboard-landing-template
          </a>
          . The Quokra name and logo are not covered by the license.
        </p>
      </div>
    </footer>
  )
}
