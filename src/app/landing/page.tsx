import { Link } from "react-router-dom"
import {
  ArrowRight,
  ChartArea,
  Mail,
  MessageCircle,
  Moon,
  Search,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { getUser } from "@/lib/auth"

const features = [
  {
    icon: ChartArea,
    title: "Dashboard",
    text: "Stat cards, an interactive area chart and a sortable data table.",
  },
  {
    icon: Users,
    title: "Users",
    text: "A full user table with filters and an add/edit dialog.",
  },
  {
    icon: Mail,
    title: "Mail",
    text: "Inbox, folders and a reading pane, ready for real data.",
  },
  {
    icon: MessageCircle,
    title: "Chat",
    text: "Conversation list and message thread with a composer.",
  },
  {
    icon: Search,
    title: "Command search",
    text: "Jump to any page with ⌘K from anywhere in the app.",
  },
  {
    icon: Moon,
    title: "Light and dark",
    text: "Theme follows the system, with a toggle in the header.",
  },
]

function PrimaryCta() {
  const signedIn = getUser() !== null
  return (
    <Button
      size="lg"
      nativeButton={false}
      render={<Link to={signedIn ? "/dashboard" : "/login"} />}
    >
      {signedIn ? "Open dashboard" : "Sign in"}
      <ArrowRight data-icon="inline-end" />
    </Button>
  )
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Logo size={20} />
            </div>
            Quokra Playground
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
              nativeButton={false}
              render={<a href="#features" />}
            >
              Features
            </Button>
            <ModeToggle />
            <PrimaryCta />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-24 text-center md:py-32">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Admin dashboard playground
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
            A realistic admin UI to test your ideas against
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            Sign in, click around a working dashboard, and wire it to your own
            API when you are ready. Nothing to set up.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <PrimaryCta />
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href="#features" />}
            >
              See what's inside
            </Button>
          </div>
        </section>

        <section id="features" className="scroll-mt-14 border-t bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              What's inside
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-background p-6">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-4 font-medium">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border p-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Ready to poke around?</h2>
              <p className="mt-1 text-muted-foreground">
                Any email and password gets you in.
              </p>
            </div>
            <PrimaryCta />
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
          Quokra Playground · based on{" "}
          <a
            href="https://github.com/shadcnstore/shadcn-dashboard-landing-template"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            shadcn-dashboard-landing-template
          </a>
        </div>
      </footer>
    </div>
  )
}
