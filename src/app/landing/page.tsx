import { Link } from "react-router-dom"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  DemoButton,
  MarketingFooter,
  MarketingHeader,
} from "./components/site-chrome"

// One conversation from first question to human reply, shown in the hero
const transcript = [
  { from: "customer", text: "How do I reset my password?" },
  {
    from: "bot",
    text: "Open Settings → Account and choose “Reset password”. You'll get an email within a minute.",
  },
  { from: "customer", text: "I never got the email. Can I talk to a person?" },
  { from: "event", text: "Sam from support joined" },
  {
    from: "agent",
    text: "Hi, Sam here. I can see the whole chat. Let me resend it to you now.",
  },
] as const

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
      "One script tag, any stack (HTML, React, Next.js, Vue)",
      "Uses your existing login for agents (OIDC)",
      "Identify logged-in customers with a signed token",
      "JavaScript API and events",
      "REST and WebSocket API documented",
    ],
    link: { to: "/docs", label: "Read the developer docs" },
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
    q: "Is there AI?",
    a: "Not yet. v1 answers from your FAQ; AI answers are planned.",
  },
]

function Transcript() {
  return (
    <figure className="rounded-2xl border bg-card p-5 sm:p-6">
      <ol className="space-y-3 text-sm">
        {transcript.map((m, i) =>
          m.from === "event" ? (
            <li
              key={i}
              className="flex items-center gap-3 py-1 text-xs text-muted-foreground"
            >
              <span className="h-px flex-1 bg-border" />
              {m.text}
              <span className="h-px flex-1 bg-border" />
            </li>
          ) : (
            <li
              key={i}
              className={m.from === "customer" ? "flex justify-end" : "flex"}
            >
              <div className="max-w-[85%]">
                {m.from !== "customer" && (
                  <p className="mb-1 text-xs text-muted-foreground">
                    {m.from === "bot" ? "Bot" : "Sam · Support"}
                  </p>
                )}
                <p
                  className={
                    m.from === "customer"
                      ? "rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-primary-foreground"
                      : "rounded-2xl rounded-bl-sm bg-muted px-4 py-2"
                  }
                >
                  {m.text}
                </p>
              </div>
            </li>
          )
        )}
      </ol>
      <figcaption className="mt-5 border-t pt-4 text-xs text-muted-foreground">
        One conversation: the bot answers, the customer asks for a person, and
        an agent picks it up with the full history.
      </figcaption>
    </figure>
  )
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <MarketingHeader />

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-12 px-4 pt-16 pb-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:pt-24 lg:pb-28">
          <div>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Bot first. Human when it matters.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-pretty text-muted-foreground">
              Quokra answers common questions instantly, then hands the chat to
              your team without losing a word. Add the chat to your site and the
              agent console to your dashboard, each with one script tag.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <DemoButton />
              <Button
                size="lg"
                variant="ghost"
                nativeButton={false}
                render={<Link to="/docs" />}
              >
                See the integration
              </Button>
            </div>
          </div>
          <Transcript />
        </section>

        <section id="how-it-works" className="border-t bg-muted/40">
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

        <section id="features" className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              What you get
            </h2>
            <div className="mt-10 divide-y border-y">
              {audiences.map((group) => (
                <div
                  key={group.title}
                  className="grid gap-4 py-8 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-10"
                >
                  <h3 className="font-medium">{group.title}</h3>
                  <div>
                    <ul className="grid gap-x-10 gap-y-2 text-muted-foreground sm:grid-cols-2">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {group.link && (
                      <Link
                        to={group.link.to}
                        className="mt-4 inline-block text-sm font-medium underline underline-offset-4 hover:text-primary"
                      >
                        {group.link.label}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="demo"
          className="border-t bg-primary text-primary-foreground"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight">
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

        <section id="faq" className="border-t">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Questions
              </h2>
              <p className="mt-3 text-muted-foreground">
                More detail in the{" "}
                <Link
                  to="/docs"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  developer docs
                </Link>
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
      </main>

      <MarketingFooter />
    </div>
  )
}
