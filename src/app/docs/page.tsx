import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import {
  DemoButton,
  MarketingFooter,
  MarketingHeader,
} from "@/app/landing/components/site-chrome"
import { docsUrl } from "@/app/landing/links"

const toc = [
  { id: "integrate", label: "Integrate" },
  { id: "guides", label: "Guides" },
  { id: "api", label: "API at a glance" },
  { id: "customize", label: "Make it yours" },
  { id: "security", label: "Security" },
]

const steps = [
  {
    title: "Add the chat to your site",
    intro: "One script tag on any page of your website.",
    blocks: [
      {
        code: `<script src="https://chat.example.com/sdk.js"
        data-quokra-chat="your-slug"
        data-quokra-pk="pk_live_…"
        async></script>`,
      },
    ],
  },
  {
    title: "Add the console to your dashboard",
    intro: "Mount the full agent console on a page of your dashboard:",
    blocks: [
      {
        code: `<div id="support" style="height: 100vh"></div>
<script src="https://chat.example.com/sdk.js"></script>
<script>
  Quokra.console.mount("#support", {
    tenant: "your-slug",
    getToken: () => auth.getAccessToken(), // your dashboard's login
  });
</script>`,
      },
      {
        lead: "Or a floating button with a side drawer on every page:",
        code: `Quokra.console.init({
  mode: "bubble",
  tenant: "your-slug",
  getToken: () => auth.getAccessToken(),
  fullView: (id) => router.push(id ? \`/support?conversation=\${id}\` : "/support"),
});`,
      },
    ],
  },
  {
    title: "Identify logged-in customers (optional)",
    intro: "On your backend, sign a short token with your secret key:",
    blocks: [
      {
        code: `import { SignJWT } from "jose";

const token = await new SignJWT({ name: user.name, email: user.email })
  .setProtectedHeader({ alg: "HS256" })
  .setSubject(user.id)
  .setIssuedAt()
  .setExpirationTime("5m")
  .sign(new TextEncoder().encode(process.env.QUOKRA_SECRET_KEY));`,
      },
      {
        lead: "Then in the page:",
        code: `Quokra.chat.identify(token);   // after login
Quokra.chat.logout();          // on logout`,
      },
    ],
  },
]

// The step-by-step guides in the Quokra repo (docs/guides), summed up.
const guides = [
  {
    file: "guides/01-get-started.md",
    title: "Get started",
    summary:
      "Run Quokra, PostgreSQL and a demo login with Docker, and try both sides of a chat.",
    steps: [
      "docker compose up --build in the Quokra repo",
      "Chat as a customer at localhost:8080/w/demo?pk=pk_test_demo",
      "Answer as sam / sam from this playground's Support page",
    ],
  },
  {
    file: "guides/02-set-up-a-company.md",
    title: "Set up a company",
    summary:
      "Admins create each company in the console's Admin tab and get its keys and embed code.",
    steps: [
      "Admin → New company: slug, name, colour, bot file, when quiet chats close",
      "List the websites (chat) and dashboards (console) allowed to embed it",
      "Copy the publishable key and the ready-made embed snippets",
      "Add agents by work email; create the secret key if you identify customers",
    ],
  },
  {
    file: "guides/03-add-the-chat.md",
    title: "Add the chat to a website",
    summary: "One script tag for a bubble, or inline and popup placements.",
    steps: [
      "Paste the script tag before </body>",
      "Optional: data-quokra-theme, data-quokra-accent, data-quokra-position",
      "Listen for unavailable to show your own contact options if Quokra is down",
    ],
  },
  {
    file: "guides/04-add-the-console.md",
    title: "Add the console to a dashboard",
    summary:
      "A full Support page, or a button with a side drawer on every page.",
    steps: [
      "Quokra.console.mount on your Support page, with getToken from your login",
      'Or Quokra.console.init({ mode: "bubble" }) in your layout, with fullView',
      "Pass notifications: true for sounds, toasts and browser notifications",
    ],
  },
  {
    file: "guides/05-identify-customers.md",
    title: "Identify logged-in customers",
    summary:
      "Agents see who they're talking to; customers keep one chat across devices.",
    steps: [
      "Your backend signs a 5-minute HS256 token with the company's secret key",
      "The page calls Quokra.chat.identify(token) after login",
      "Call Quokra.chat.logout() when they log out",
    ],
  },
  {
    file: "guides/06-connect-your-login.md",
    title: "Connect your identity provider",
    summary:
      "Agents sign in with your company login: Keycloak, Auth0, Okta, Entra ID or your own.",
    steps: [
      "Roles SUPPORT_AGENT and QUOKRA_ADMIN, audience quokra-api in access tokens",
      "Set OIDC_ISSUER_URI (and the roles claim) on the Quokra server",
      "Check with GET /api/v1/agent/me: 200 is good, 401 bad token, 403 missing role",
    ],
  },
  {
    file: "guides/07-write-the-bot.md",
    title: "Write the bot",
    summary:
      "A YAML file per company: greeting, menu, keywords, urgent words and wording.",
    steps: [
      "Copy the demo bot file and point QUOKRA_BOTS_DIR at your folder",
      "Write the menu answers and keywords; add urgent words that go straight to the team",
      "Pick the file for the company in the Admin tab",
    ],
  },
  {
    file: "guides/08-notifications.md",
    title: "Notifications",
    summary:
      "New chats, replies in my chats, transfers and notes, each with its own sound.",
    steps: [
      "The dashboard passes notifications: true",
      "Agents click Turn on once to allow browser notifications",
      "The bell menu chooses what notifies each agent, and how",
    ],
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
    "Waiting chats plus unread in my chats, e.g. for a nav badge",
  ],
  [
    "notifications: true",
    "Console option: sounds, toasts and browser notifications for agents",
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
  "conversation.transferred",
  "note.created",
  "note.added",
]

const customizations = [
  [
    "Theme",
    "Follows your page's light or dark mode automatically, or force light, dark or auto.",
  ],
  [
    "Brand colour",
    'Set per company, or pass accent: "#0f766e" from your page.',
  ],
  [
    "Wording",
    "Greeting, menu, answers, header status and the bot's questions come from a per-company file. No code change.",
  ],
  [
    "Placement",
    "Bottom right or left, inline in your page, or a popup from your own button.",
  ],
]

const securityPoints = [
  "Each site that may embed the chat or console is registered, and the browser blocks everyone else (frame-ancestors).",
  "Agents sign in through your identity provider; Quokra checks the token, the role and team membership on every request.",
  "Customer identity is signed by your backend with a secret that never reaches the browser, and tokens live at most 5 minutes.",
  "Rate limits, blocked contacts, and messages always shown as plain text.",
]

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

function Heading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="scroll-mt-8 text-2xl font-semibold tracking-tight md:text-3xl"
    >
      {children}
    </h2>
  )
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50 text-left text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} className="p-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([first, ...rest]) => (
            <tr key={first} className="border-b last:border-0">
              <td className="p-3 font-mono text-xs whitespace-nowrap">
                {first}
              </td>
              {rest.map((cell, i) => (
                <td
                  key={i}
                  className={
                    i === rest.length - 1
                      ? "p-3 text-muted-foreground"
                      : "p-3 whitespace-nowrap"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DocsPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <MarketingHeader />

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-4 py-12 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-8 space-y-1 border-l text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="-ml-px block border-l border-transparent py-1 pl-4 text-muted-foreground hover:border-foreground hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Developer docs
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Works with React, Next.js, Vue or plain HTML. This demo uses Vite +
            React Router. These are the essentials; the{" "}
            <a
              href={docsUrl("EMBEDDING.md")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Quokra repo
            </a>{" "}
            has the full reference.
          </p>

          <section className="mt-16">
            <Heading id="integrate">Integrate in minutes</Heading>
            <ol className="mt-8 space-y-12">
              {steps.map((step, i) => (
                <li key={step.title} className="space-y-4">
                  <h3 className="text-lg font-medium">
                    <span className="mr-2 text-muted-foreground tabular-nums">
                      {i + 1}.
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.intro}</p>
                  {step.blocks.map((block) => (
                    <div key={block.code} className="space-y-3">
                      {"lead" in block && (
                        <p className="text-muted-foreground">{block.lead}</p>
                      )}
                      <CodeBlock>{block.code}</CodeBlock>
                    </div>
                  ))}
                </li>
              ))}
            </ol>
            <p className="mt-8">
              <DocsLink file="EMBEDDING.md">Full embedding guide</DocsLink>
            </p>
          </section>

          <section className="mt-20">
            <Heading id="guides">Guides</Heading>
            <p className="mt-4 text-muted-foreground">
              Step by step, from running it locally to notifications. Each links
              to the full guide in the Quokra repo.
            </p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {guides.map((guide, i) => (
                <li
                  key={guide.file}
                  className="flex flex-col gap-3 rounded-xl border p-5"
                >
                  <h3 className="font-medium">
                    <span className="mr-2 text-muted-foreground tabular-nums">
                      {i + 1}.
                    </span>
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {guide.summary}
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm marker:text-foreground/40">
                    {guide.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-1">
                    <DocsLink file={guide.file}>Read the guide</DocsLink>
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-20 space-y-10">
            <Heading id="api">API at a glance</Heading>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                JavaScript SDK (<code>sdk.js</code>)
              </h3>
              <Table head={["Call", "What it does"]} rows={sdkCalls} />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                REST API (<code>/api/v1</code>)
              </h3>
              <Table head={["Endpoint", "Who", "What"]} rows={restEndpoints} />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Realtime (WebSocket, STOMP)
              </h3>
              <div className="flex flex-wrap gap-2">
                {realtimeEvents.map((e) => (
                  <Badge key={e} variant="secondary" className="font-mono">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>
            <DocsLink file="API.md">Full API reference</DocsLink>
          </section>

          <section className="mt-20">
            <Heading id="customize">Make it yours</Heading>
            <dl className="mt-8 divide-y border-y">
              {customizations.map(([term, text]) => (
                <div
                  key={term}
                  className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="font-medium">{term}</dt>
                  <dd className="text-muted-foreground">{text}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-20">
            <Heading id="security">Security</Heading>
            <ul className="mt-8 list-disc space-y-3 pl-5 text-muted-foreground marker:text-foreground/40">
              {securityPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <div className="mt-20 flex flex-col gap-4 border-t pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground">
              See it working before you integrate.
            </p>
            <DemoButton />
          </div>
        </main>
      </div>

      <MarketingFooter />
    </div>
  )
}
