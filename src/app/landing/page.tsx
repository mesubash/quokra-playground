import { Link } from "react-router-dom"
import {
  ArrowRight,
  Bot,
  Headset,
  MessageCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { getUser } from "@/lib/auth"

const QUOKRA_REPO = "https://github.com/mesubash/quokra"
const docsUrl = (file: string) => `${QUOKRA_REPO}/blob/main/docs/${file}`

const nav = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Integrate", href: "#integrate" },
  { label: "API", href: "#api" },
]

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: MessageCircle,
    title: "A customer opens the chat",
    text: "On your website: as a bubble, inline in the page, or as a popup.",
  },
  {
    icon: Bot,
    title: "The bot answers first",
    text: "From your FAQ menu and keywords. Urgent words like “outage” go straight to the team, marked urgent.",
  },
  {
    icon: UserRound,
    title: "“Talk to a person”",
    text: "The bot asks for an email (and a name, which can be skipped) in the chat, then puts the conversation in your team's queue. Logged-in customers skip this step.",
  },
  {
    icon: Headset,
    title: "An agent takes over",
    text: "From the console in your dashboard. They see the whole history and reply live.",
  },
]

const featureGroups = [
  {
    title: "For your customers",
    items: [
      "Chat bubble, inline panel or popup",
      "Instant answers from your FAQ",
      "Handoff to a person in the same chat",
      "Works across devices when they're logged in",
      "Follows your site's light or dark mode",
    ],
  },
  {
    title: "For your team",
    items: [
      "Console in your own dashboard, full page or drawer",
      "Queue, my chats and resolved lists with unread counts",
      "Search by name, email or message",
      "Reply, private notes, transfer, resolve, reopen",
      "Block abusive contacts",
      "New-chat sound and live updates",
    ],
  },
  {
    title: "For developers",
    items: [
      "One script tag, any stack (HTML, React, Next.js, Vue)",
      "Uses your existing login for agents (OIDC)",
      "Identify logged-in customers with a signed token",
      "JavaScript API and events (open, unread, identified…)",
      "REST and WebSocket API documented",
    ],
  },
]

const snippets = [
  {
    value: "chat",
    label: "1. Chat on your site",
    intro: "Add one script tag to any page of your website.",
    code: `<script src="https://chat.example.com/sdk.js"
        data-quokra-chat="your-slug"
        data-quokra-pk="pk_live_…"
        async></script>`,
  },
  {
    value: "console",
    label: "2. Console in your dashboard",
    intro: "Mount the full agent console on a page of your dashboard:",
    code: `<div id="support" style="height: 100vh"></div>
<script src="https://chat.example.com/sdk.js"></script>
<script>
  Quokra.console.mount("#support", {
    tenant: "your-slug",
    getToken: () => auth.getAccessToken(), // your dashboard's login
  });
</script>`,
    outro: "Or a floating button with a side drawer on every page:",
    extra: `Quokra.console.init({
  mode: "bubble",
  tenant: "your-slug",
  getToken: () => auth.getAccessToken(),
  fullView: (id) => router.push(id ? \`/support?conversation=\${id}\` : "/support"),
});`,
  },
  {
    value: "identify",
    label: "3. Identify customers",
    intro:
      "Optional. On your backend, sign a short token with your secret key:",
    code: `import { SignJWT } from "jose";

const token = await new SignJWT({ name: user.name, email: user.email })
  .setProtectedHeader({ alg: "HS256" })
  .setSubject(user.id)
  .setIssuedAt()
  .setExpirationTime("5m")
  .sign(new TextEncoder().encode(process.env.QUOKRA_SECRET_KEY));`,
    outro: "Then in the page:",
    extra: `Quokra.chat.identify(token);   // after login
Quokra.chat.logout();          // on logout`,
  },
]

const sdkCalls = [
  [
    "Quokra.chat.init({ slug, pk, mode, theme, accent })",
    "Show the chat (bubble, inline or popup)",
  ],
  ["Quokra.chat.open() / close()", "Open or close it"],
  [
    "Quokra.chat.identify(token) / logout()",
    "Link to or forget the logged-in customer",
  ],
  [
    'Quokra.chat.on("unread", n => …)',
    "Events: ready, open, close, unread, identified",
  ],
  ["Quokra.console.mount(el, { tenant, getToken })", "Full-page agent console"],
  [
    'Quokra.console.init({ mode: "bubble", … })',
    "Console in a drawer from a floating button",
  ],
  [
    'Quokra.console.on("unread", n => …)',
    "Waiting chats, e.g. for a nav badge",
  ],
]

const restEndpoints = [
  ["POST /widget/sessions", "Customer chat", "Start a guest session"],
  [
    "POST /widget/sessions/identify",
    "Customer chat",
    "Switch to a logged-in customer",
  ],
  ["POST /widget/conversation/messages", "Customer chat", "Send a message"],
  [
    "GET /agent/conversations?status=WAITING",
    "Agents",
    "Queue (paged, searchable)",
  ],
  ["POST /agent/conversations/{id}/accept", "Agents", "Take a conversation"],
  ["POST /agent/conversations/{id}/messages", "Agents", "Reply"],
  ["POST /agent/conversations/{id}/resolve", "Agents", "Close it"],
]

const realtimeEvents = [
  "message.created",
  "conversation.updated",
  "conversation.waiting",
  "conversation.activity",
  "note.created",
]

const customizations = [
  {
    title: "Theme",
    text: "Follows your page's light or dark mode automatically, or force light, dark or auto.",
  },
  {
    title: "Brand colour",
    text: 'Set per company, or pass accent: "#0f766e" from your page.',
  },
  {
    title: "Wording",
    text: "Greeting, menu, answers, header status and the bot's questions come from a per-company file. No code change.",
  },
  {
    title: "Placement",
    text: "Bottom right or left, inline in your page, or a popup from your own button.",
  },
]

const securityPoints = [
  "Each site that may embed the chat or console is registered, and the browser blocks everyone else (frame-ancestors).",
  "Agents sign in through your identity provider; Quokra checks the token, the role and team membership on every request.",
  "Customer identity is signed by your backend with a secret that never reaches the browser, and tokens live at most 5 minutes.",
  "Rate limits, blocked contacts, and messages always shown as plain text.",
]

const faqs = [
  {
    q: "Do I need to change my site's code?",
    a: "One script tag for the chat. For the console, a few lines in your dashboard.",
  },
  {
    q: "Does it work with my framework?",
    a: "Yes: it's a script tag and an iframe, so any stack works.",
  },
  {
    q: "Can customers chat without logging in?",
    a: "Yes, as guests. They leave an email before talking to a person.",
  },
  {
    q: "How do agents log in?",
    a: "With your dashboard's existing login (OIDC).",
  },
  {
    q: "Can I change the colours and texts?",
    a: "Yes, per company, without code.",
  },
  {
    q: "Is there AI?",
    a: "Not yet. v1 answers from your FAQ; AI answers are planned.",
  },
]

const docLinks = [
  { label: "Quokra on GitHub", href: QUOKRA_REPO },
  { label: "Embedding guide", href: docsUrl("EMBEDDING.md") },
  { label: "API reference", href: docsUrl("API.md") },
  {
    label: "Template credit",
    href: "https://github.com/shadcnstore/shadcn-dashboard-landing-template",
  },
]

function PrimaryCta({ label = "Try the demo" }: { label?: string }) {
  const user = getUser()
  const to = user
    ? user.role === "agent"
      ? "/support"
      : "/dashboard"
    : "/login"
  return (
    <Button size="lg" nativeButton={false} render={<Link to={to} />}>
      {user ? "Open the demo" : label}
      <ArrowRight data-icon="inline-end" />
    </Button>
  )
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
      <code>{children}</code>
    </pre>
  )
}

function Section({
  id,
  title,
  intro,
  muted,
  children,
}: {
  id: string
  title: string
  intro?: string
  muted?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-14 border-t ${muted ? "bg-muted/40" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        {intro && (
          <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>
        )}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}

function DocsLink({ file, children }: { file: string; children: string }) {
  return (
    <a
      href={docsUrl(file)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium underline underline-offset-4 hover:text-primary"
    >
      {children}
    </a>
  )
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Logo size={32} />
            Quokra Playground
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            {nav.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="hidden md:inline-flex"
                nativeButton={false}
                render={<a href={item.href} />}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="hidden md:inline-flex"
              nativeButton={false}
              render={
                <a
                  href={QUOKRA_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Docs
            </Button>
            <ModeToggle />
            <Button nativeButton={false} render={<Link to="/login" />}>
              Sign in
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 py-24 text-center md:py-32">
          <Badge variant="outline" className="mb-6">
            Embeddable support chat
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Bot first. Human when it matters. Same conversation.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
            Quokra answers common questions instantly, then hands the chat to
            your team without losing a word. Add the chat to your site and the
            agent console to your dashboard, each with one script tag.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <PrimaryCta />
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href="#how-it-works" />}
            >
              How it works
            </Button>
          </div>
        </section>

        <Section
          id="how-it-works"
          title="How it works"
          intro="From the first question to a human reply, in one conversation."
          muted
        >
          <ol className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="bg-background p-6">
                <div className="flex items-center gap-3">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <span className="text-sm text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-medium">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="features" title="Features">
          <div className="grid gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-3">
            {featureGroups.map((group) => (
              <div key={group.title} className="bg-background p-6">
                <h3 className="font-medium">{group.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden className="text-primary">
                        –
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="demo"
          title="Try both sides"
          intro="Sign in as a customer to chat with support, or as Sam or Alex from the support team to answer from the Support page. Open one in a private window to watch it happen live."
          muted
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: MessageCircle,
                title: "Chat as a customer",
                text: "Any email works. Ask the bot, then ask for a person.",
              },
              {
                icon: Headset,
                title: "Answer as an agent",
                text: "Pick Sam or Alex on the Support agent tab.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Link
                key={title}
                to="/login"
                className="group flex items-start gap-4 rounded-xl border bg-background p-6 transition-colors hover:border-primary"
              >
                <Icon className="mt-0.5 size-5 text-primary" aria-hidden />
                <div className="flex-1">
                  <h3 className="font-medium">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
                <ArrowRight
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </Section>

        <Section
          id="integrate"
          title="Integrate in minutes"
          intro="Works with React, Next.js, Vue or plain HTML. This demo uses Vite + React Router."
        >
          <Tabs defaultValue="chat">
            <TabsList className="mb-6 h-auto flex-wrap">
              {snippets.map((s) => (
                <TabsTrigger key={s.value} value={s.value}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {snippets.map((s) => (
              <TabsContent key={s.value} value={s.value} className="space-y-4">
                <p className="text-muted-foreground">{s.intro}</p>
                <Code>{s.code}</Code>
                {s.outro && <p className="text-muted-foreground">{s.outro}</p>}
                {s.extra && <Code>{s.extra}</Code>}
              </TabsContent>
            ))}
          </Tabs>
          <p className="mt-6">
            <DocsLink file="EMBEDDING.md">Read the embedding guide</DocsLink>
          </p>
        </Section>

        <Section id="api" title="API at a glance" muted>
          <div className="space-y-10">
            <div>
              <h3 className="font-medium">
                JavaScript SDK (<code>sdk.js</code>)
              </h3>
              <div className="mt-4 overflow-x-auto rounded-xl border bg-background">
                <table className="w-full text-sm">
                  <thead className="border-b text-left text-muted-foreground">
                    <tr>
                      <th className="p-3 font-medium">Call</th>
                      <th className="p-3 font-medium">What it does</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sdkCalls.map(([call, what]) => (
                      <tr key={call} className="border-b last:border-0">
                        <td className="p-3 font-mono text-xs whitespace-nowrap">
                          {call}
                        </td>
                        <td className="p-3 text-muted-foreground">{what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-medium">
                REST API (<code>/api/v1</code>)
              </h3>
              <div className="mt-4 overflow-x-auto rounded-xl border bg-background">
                <table className="w-full text-sm">
                  <thead className="border-b text-left text-muted-foreground">
                    <tr>
                      <th className="p-3 font-medium">Endpoint</th>
                      <th className="p-3 font-medium">Who</th>
                      <th className="p-3 font-medium">What</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restEndpoints.map(([endpoint, who, what]) => (
                      <tr key={endpoint} className="border-b last:border-0">
                        <td className="p-3 font-mono text-xs whitespace-nowrap">
                          {endpoint}
                        </td>
                        <td className="p-3 whitespace-nowrap">{who}</td>
                        <td className="p-3 text-muted-foreground">{what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Realtime (WebSocket, STOMP)</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {realtimeEvents.map((e) => (
                  <Badge key={e} variant="secondary" className="font-mono">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>

            <DocsLink file="API.md">Full API reference</DocsLink>
          </div>
        </Section>

        <Section id="customize" title="Make it yours">
          <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {customizations.map(({ title, text }) => (
              <div key={title} className="bg-background p-6">
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="security" title="Security" muted>
          <ul className="grid gap-4 sm:grid-cols-2">
            {securityPoints.map((point) => (
              <li
                key={point}
                className="rounded-xl border bg-background p-6 text-sm text-muted-foreground"
              >
                {point}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="faq" title="FAQ">
          <Accordion className="max-w-3xl">
            {faqs.map(({ q, a }) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>

        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="flex flex-col items-start justify-between gap-6 rounded-xl border p-8 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-semibold">See it working</h2>
                <p className="mt-1 text-muted-foreground">
                  Sign in as a customer or an agent. No setup needed.
                </p>
              </div>
              <PrimaryCta />
            </div>
          </div>
        </section>
      </main>

      {/* Leave room on the right for the Quokra chat bubble */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 pr-24 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>Quokra Playground · powered by Quokra</span>
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            {docLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
