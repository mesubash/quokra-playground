import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code-block"
import {
  DemoButton,
  GitHubButton,
  MarketingFooter,
  MarketingHeader,
} from "./components/site-chrome"
import { docsUrl } from "./links"

const stacks = ["Plain HTML", "React", "Next.js", "Vue"]

const steps = [
  {
    title: "A customer opens the chat",
    text: "On your website: as a bubble, inline in the page, or as a popup.",
  },
  {
    title: "The bot answers first",
    text: "From your FAQ menu and keywords. Urgent words like “outage” go straight to the team, marked urgent.",
  },
  {
    title: "“Talk to a person”",
    text: "The bot asks for an email (and a name, which can be skipped) in the chat, then puts the conversation in your team's queue. Logged-in customers skip this step.",
  },
  {
    title: "An agent takes over",
    text: "From the console in your dashboard. They see the whole history and reply live.",
  },
]

const audiences = [
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
      "One script tag, any stack",
      "Uses your existing login for agents (OIDC)",
      "Identify logged-in customers with a signed token",
      "JavaScript API and events",
      "REST and WebSocket API documented",
    ],
  },
]

// From docs/PLAN.md in the Quokra repo
const roadmap = [
  {
    version: "v1",
    title: "FAQ bot + human handoff",
    status: "Now",
    items: [
      "Customer chat and agent console via one script tag",
      "Left for v1: real agent login against an identity provider, tenant setup tooling, the Docker image",
    ],
  },
  {
    version: "v2",
    title: "Daily operations",
    status: "Planned",
    items: [
      "Canned replies, business hours and offline messages",
      "Attachments, browser notifications, FAQ editing in the console",
      "Standalone console login, more languages",
    ],
  },
  {
    version: "v3",
    title: "AI answers",
    status: "Planned",
    items: [
      "Answers grounded in your documents, with sources",
      "Summary for the agent on handoff",
    ],
  },
  {
    version: "v4",
    title: "Channels",
    status: "Planned",
    items: ["WhatsApp and email", "Identity-verified lookups via your backend"],
  },
  {
    version: "v5",
    title: "Platform",
    status: "Later",
    items: ["Tenant self-service, analytics and CSAT", "Public release"],
  },
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
    q: "Where does it run?",
    a: "On your own server: a Spring Boot app with PostgreSQL. A Docker image is on the v1 list.",
  },
  {
    q: "Is there AI?",
    a: "Not yet. v1 answers from your FAQ; AI answers are planned for v3.",
  },
]

function Shot({
  src,
  alt,
  width,
  height,
  className = "",
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className={`h-auto rounded-xl border shadow-sm ${className}`}
    />
  )
}

function FeatureRow({
  title,
  text,
  points,
  image,
  flip,
}: {
  title: string
  text: string
  points: string[]
  image: React.ReactNode
  flip?: boolean
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
      <div className={flip ? "md:order-2" : ""}>
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-3 text-muted-foreground">{text}</p>
        <ul className="mt-6 space-y-2 text-sm">
          {points.map((p) => (
            <li key={p} className="flex gap-3">
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/40"
              />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className={`flex justify-center ${flip ? "md:order-1" : ""}`}>
        {image}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const { hash } = useLocation()
  // Router links like "/#roadmap" don't scroll on their own
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <MarketingHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-16 lg:pt-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Bot first. Human when it matters.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
              Quokra answers common questions instantly, then hands the chat to
              your team without losing a word. Add the chat to your site and the
              agent console to your dashboard, each with one script tag.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <DemoButton />
              <GitHubButton />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Self-hosted · Spring Boot + PostgreSQL · Works with any stack
            </p>
          </div>
          <figure className="mt-14 lg:mt-20">
            <Shot
              src="/screens/dashboard-with-chat.jpg"
              alt="The playground dashboard with the Quokra chat open: the bot answered a pricing question, and the customer asked to talk to a person."
              width={1560}
              height={784}
              className="w-full"
            />
            <figcaption className="mt-3 text-sm text-muted-foreground">
              The chat inside this playground's dashboard, handing a customer
              over to the team.
            </figcaption>
          </figure>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-4 border-y py-6 sm:flex-row sm:items-center sm:gap-8">
            <p className="text-sm whitespace-nowrap text-muted-foreground">
              Drops into
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-lg font-medium">
              {stacks.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <Link
              to="/docs"
              className="text-sm whitespace-nowrap underline underline-offset-4 hover:text-primary sm:ml-auto"
            >
              See the snippets
            </Link>
          </div>
        </section>

        <section id="product" className="scroll-mt-4">
          <div className="mx-auto max-w-6xl space-y-24 px-4 py-16 lg:space-y-32 lg:py-24">
            <FeatureRow
              title="Answers first, from your FAQ"
              text="A menu and keywords per company. Common questions get an answer straight away, and urgent words go to the team."
              points={[
                "Bubble, inline panel or popup",
                "Your brand colour and wording, no code change",
                "Guests and logged-in customers",
              ]}
              image={
                <Shot
                  src="/screens/chat-bot-menu.jpg"
                  alt="The Quokra chat greeting a guest with topic buttons: Pricing, Account help, Opening hours, Talk to a person."
                  width={312}
                  height={490}
                  className="w-full max-w-[312px]"
                />
              }
            />
            <FeatureRow
              flip
              title="Hands off without losing a word"
              text="When the customer asks for a person, the bot doesn't understand twice, or an urgent keyword appears, the chat goes to your team's queue."
              points={[
                "Email and name collected in the chat for guests",
                "Logged-in customers keep one conversation across devices",
                "The agent sees the whole history",
              ]}
              image={
                <Shot
                  src="/screens/chat-handoff.jpg"
                  alt="The customer asks to talk to a person and the chat says it is connecting them with the team."
                  width={312}
                  height={490}
                  className="w-full max-w-[312px]"
                />
              }
            />
          </div>

          <div className="border-y bg-muted/40">
            <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
              <div className="max-w-2xl">
                <h3 className="text-2xl font-semibold tracking-tight">
                  A console inside the dashboard your team already uses
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Full page or a drawer from a floating button, signed in with
                  your dashboard's own login. Queue, my chats and resolved
                  lists, with unread counts and live updates.
                </p>
              </div>
              <Shot
                src="/screens/agent-console.jpg"
                alt="The Quokra agent console: Sam's assigned chats on the left, including one marked urgent, and the conversation with Pat on the right, where Sam joined and replied."
                width={1312}
                height={582}
                className="mt-10 w-full"
              />
              <ul className="mt-8 grid gap-x-10 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "Reply, which also accepts the chat",
                  "Private notes for the team",
                  "Transfer, return to the bot, resolve, reopen",
                  "Search by name, email or message",
                  "Block abusive contacts",
                  "A sound for new chats",
                ].map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
            <FeatureRow
              title="Looks like it belongs"
              text="Quokra follows your page's light or dark mode by itself, or a theme you choose, with your own accent colour."
              points={[
                "Light, dark or auto",
                "Per-company accent colour",
                "Bottom right or left, or inline in your page",
              ]}
              image={
                <Shot
                  src="/screens/agent-console-dark.jpg"
                  alt="The same agent console in dark mode, matching the dashboard around it."
                  width={1312}
                  height={582}
                  className="w-full"
                />
              }
            />
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-4 border-t bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-20 lg:py-24">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              How it works
            </h2>
            <ol className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="text-3xl leading-none font-semibold text-muted-foreground/60 tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Everything in v1
            </h2>
            <div className="mt-10 divide-y border-y">
              {audiences.map((group) => (
                <div
                  key={group.title}
                  className="grid gap-4 py-8 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-10"
                >
                  <h3 className="font-medium">{group.title}</h3>
                  <ul className="grid gap-x-10 gap-y-2 text-muted-foreground sm:grid-cols-2">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16 lg:py-24">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Runs on your server
              </h2>
              <p className="mt-3 text-muted-foreground">
                One Spring Boot app serves the API, the realtime connection, the
                bot and both UIs. Your data stays in your PostgreSQL.
              </p>
              <dl className="mt-8 space-y-3 text-sm">
                {[
                  ["Server", "Spring Boot 4.1, Java 21"],
                  ["Database", "PostgreSQL"],
                  ["UI", "React + TypeScript (Vite)"],
                  ["Realtime", "STOMP over WebSocket"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6rem_minmax(0,1fr)]">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={docsUrl("DEVELOPMENT.md")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block text-sm font-medium underline underline-offset-4 hover:text-primary"
              >
                Development guide
              </a>
            </div>
            <div className="min-w-0">
              <p className="mb-3 text-sm text-muted-foreground">
                Run it locally (needs Java 21+, Docker and pnpm):
              </p>
              <CodeBlock>{`cd web && pnpm install && pnpm build
cd ../server && ./mvnw spring-boot:run \\
  -Dspring-boot.run.profiles=dev
# http://localhost:8080/console`}</CodeBlock>
              <p className="mt-3 text-sm text-muted-foreground">
                The dev profile starts PostgreSQL with Docker Compose and loads
                a demo tenant.
              </p>
            </div>
          </div>
        </section>

        <section id="roadmap" className="scroll-mt-4 border-t bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-20 lg:py-24">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Roadmap
              </h2>
              <a
                href={docsUrl("PLAN.md")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline underline-offset-4 hover:text-primary"
              >
                Read the full plan
              </a>
            </div>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-5">
              {roadmap.map((r) => (
                <li
                  key={r.version}
                  className={
                    r.status === "Now"
                      ? "bg-background p-5"
                      : "bg-background/60 p-5"
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm tabular-nums">
                      {r.version}
                    </span>
                    <Badge variant={r.status === "Now" ? "default" : "outline"}>
                      {r.status}
                    </Badge>
                  </div>
                  <h3 className="mt-4 font-medium">{r.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {r.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="faq" className="border-t">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Questions
              </h2>
              <p className="mt-3 text-muted-foreground">
                Something else?{" "}
                <a
                  href="https://github.com/mesubash/quokra/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Open an issue
                </a>
                .
              </p>
            </div>
            <Accordion>
              {faqs.map(({ q, a }) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="border-t bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Try both sides
              </h2>
              <p className="mt-2 opacity-80">
                Sign in as a customer to chat with support, or as Sam or Alex to
                answer from the Support page. Open one in a private window to
                watch it happen live.
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              nativeButton={false}
              render={<Link to="/login" />}
            >
              Sign in to the demo
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
