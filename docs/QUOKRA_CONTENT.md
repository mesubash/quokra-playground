# Content brief: Quokra on the landing page

A brief for whoever updates the marketing page (`src/app/landing/page.tsx`) so it
explains Quokra, shows how it works, and shows developers how to integrate it.
It covers what Quokra is, which sections to add, the copy and code to use, and
the facts to keep accurate.

The source of truth is the Quokra repo
([github.com/mesubash/quokra](https://github.com/mesubash/quokra)), especially
`README.md`, `docs/EMBEDDING.md` and `docs/API.md`. If this brief and those docs
disagree, the docs win.

---

## 1. What this project is

**Quokra Playground** (this repo) is a realistic admin dashboard with Quokra
embedded the way a real product would use it. It's the live demo of Quokra:
visitors can sign in as a customer and chat, or as a support agent and answer.

**Quokra** is an embeddable support chat:

- A **FAQ bot** answers first, from a menu and keywords set per company.
- When the customer asks for a person, the bot doesn't understand twice, or an
  urgent keyword appears, a **human agent takes over in the same conversation**.
- Both sides are **embedded with one script tag**: the customer chat on any
  website, and the agent console inside any dashboard, using the dashboard's own
  login.

Audiences for the page:

| Audience | What they want to learn |
|---|---|
| Product owners / founders | What it does for their customers and team, and how it looks |
| Developers | How to embed it, what the API looks like, how auth works |
| Support teams | What the agent console can do |

---

## 2. Positioning and tone

- **One-liner:** "Support chat for your site and dashboard: a bot answers first,
  your team takes over in the same conversation."
- **Headline options:**
  - "A support chat your site and your dashboard can share"
  - "Bot first. Human when it matters. Same conversation."
  - "Add support chat to any site with one script tag"
- **Tone:** plain, short, concrete. Say what it does, not how amazing it is.
  No "revolutionary", "seamless", "AI-powered" (there is no AI in v1).

---

## 3. Suggested page structure

Keep the existing look (shadcn, `max-w-6xl`, `border-t` sections, the bordered
grid used for "What's inside"). Add these sections in this order; each has an
`id` so the header nav can link to it.

| # | Section | `id` | Purpose |
|---|---|---|---|
| 1 | Hero | | Say what Quokra is, two calls to action |
| 2 | How it works | `how-it-works` | The flow in 4 steps |
| 3 | Features | `features` | For customers / agents / developers |
| 4 | Try it live | `demo` | Sign in as customer or agent |
| 5 | Integrate in minutes | `integrate` | Code snippets |
| 6 | API at a glance | `api` | Endpoints, SDK calls, events, with links to the full docs |
| 7 | Make it yours | `customize` | Theme, colour, wording |
| 8 | Security | `security` | How tokens and data are protected |
| 9 | FAQ | `faq` | Short answers |
| 10 | Final CTA + footer | | Sign in, docs links, credits |

Header nav: How it works · Features · Integrate · API · Docs (external link to
the Quokra repo) · theme toggle · Sign in.

The existing "What's inside" grid (Dashboard, Users, Mail…) describes the
template. Either drop it or move it lower as "The demo dashboard".

---

## 4. Section copy

Use this copy as a starting point and edit it freely. Keep the facts accurate (§6).

### 4.1 Hero

- **Eyebrow:** "Embeddable support chat"
- **Headline:** "Bot first. Human when it matters. Same conversation."
- **Sub:** "Quokra answers common questions instantly, then hands the chat to
  your team without losing a word. Add the chat to your site and the agent
  console to your dashboard, each with one script tag."
- **Buttons:** "Try the demo" (→ `/login`), "How it works" (→ `#how-it-works`).

### 4.2 How it works

Four steps, each with an icon (lucide: `MessageCircle`, `Bot`, `UserRound`,
`Headset`):

1. **A customer opens the chat** on your website: bubble, inline or popup.
2. **The bot answers first** from your FAQ menu and keywords. Urgent words like
   "outage" go straight to the team, marked urgent.
3. **"Talk to a person"**: the bot asks for an email (and name, which can be
   skipped) in the chat, then puts the conversation in your team's queue.
   Logged-in customers skip this step.
4. **An agent takes over** from the console in your dashboard, sees the whole
   history, and replies live.

Optional simple diagram:

```text
Your website                    Quokra                     Your dashboard
[chat bubble] ──── messages ──► bot ─► queue ─► agent ◄── [agent console]
```

### 4.3 Features

Three columns.

**For your customers**
- Chat bubble, inline panel or popup
- Instant answers from your FAQ
- Handoff to a person in the same chat
- Works across devices when they're logged in
- Follows your site's light or dark mode

**For your team**
- Console in your own dashboard, full page or drawer
- Queue, my chats and resolved lists with unread counts
- Search by name, email or message
- Reply, private notes, transfer, resolve, reopen
- Block abusive contacts
- New-chat sound and live updates

**For developers**
- One script tag, any stack (HTML, React, Next.js, Vue)
- Uses your existing login for agents (OIDC)
- Identify logged-in customers with a signed token
- JavaScript API and events (`open`, `unread`, `identified`…)
- REST and WebSocket API documented

### 4.4 Try it live

- **Title:** "Try both sides"
- **Text:** "Sign in as a customer to chat with support, or as Sam or Alex from the
  support team to answer from the Support page. Open one in a private window
  to watch it happen live."
- **Two cards/buttons:** "Chat as a customer" and "Answer as an agent" (both →
  `/login`; the login page has Customer / Support agent tabs).

### 4.5 Integrate in minutes

Use tabs or a stepper with these snippets, exactly as written. Use
`chat.example.com` for the Quokra host and `your-slug` / `pk_live_…` as
placeholders.

**1. Add the chat to your site**

```html
<script src="https://chat.example.com/sdk.js"
        data-quokra-chat="your-slug"
        data-quokra-pk="pk_live_…"
        async></script>
```

**2. Add the console to your dashboard**

```html
<div id="support" style="height: 100vh"></div>
<script src="https://chat.example.com/sdk.js"></script>
<script>
  Quokra.console.mount("#support", {
    tenant: "your-slug",
    getToken: () => auth.getAccessToken(), // your dashboard's login
  });
</script>
```

Or a floating button with a side drawer on every page:

```js
Quokra.console.init({
  mode: "bubble",
  tenant: "your-slug",
  getToken: () => auth.getAccessToken(),
  fullView: (id) => router.push(id ? `/support?conversation=${id}` : "/support"),
});
```

**3. (Optional) Identify logged-in customers**: on your backend, sign a short
token with your secret key:

```js
import { SignJWT } from "jose";

const token = await new SignJWT({ name: user.name, email: user.email })
  .setProtectedHeader({ alg: "HS256" })
  .setSubject(user.id)
  .setIssuedAt()
  .setExpirationTime("5m")
  .sign(new TextEncoder().encode(process.env.QUOKRA_SECRET_KEY));
```

then in the page:

```js
Quokra.chat.identify(token);   // after login
Quokra.chat.logout();          // on logout
```

Add one line under the snippets: "Works with React, Next.js, Vue or plain
HTML. This demo uses Vite + React Router."

### 4.6 API at a glance

Three compact tables, each with a "Full reference" link to `docs/API.md`.

**JavaScript SDK (`sdk.js`)**

| Call | What it does |
|---|---|
| `Quokra.chat.init({ slug, pk, mode, theme, accent })` | Show the chat (bubble, inline or popup) |
| `Quokra.chat.open()` / `close()` | Open or close it |
| `Quokra.chat.identify(token)` / `logout()` | Link to or forget the logged-in customer |
| `Quokra.chat.on("unread", n => …)` | Events: `ready`, `open`, `close`, `unread`, `identified` |
| `Quokra.console.mount(el, { tenant, getToken })` | Full-page agent console |
| `Quokra.console.init({ mode: "bubble", … })` | Console in a drawer from a floating button |
| `Quokra.console.on("unread", n => …)` | Waiting chats, e.g. for a nav badge |

**REST API** (`/api/v1`)

| Endpoint | Who | What |
|---|---|---|
| `POST /widget/sessions` | Customer chat | Start a guest session |
| `POST /widget/sessions/identify` | Customer chat | Switch to a logged-in customer |
| `POST /widget/conversation/messages` | Customer chat | Send a message |
| `GET /agent/conversations?status=WAITING` | Agents | Queue (paged, searchable) |
| `POST /agent/conversations/{id}/accept` | Agents | Take a conversation |
| `POST /agent/conversations/{id}/messages` | Agents | Reply |
| `POST /agent/conversations/{id}/resolve` | Agents | Close it |

**Realtime** (WebSocket, STOMP): `message.created`, `conversation.updated`,
`conversation.waiting`, `conversation.activity`, `note.created`.

### 4.7 Make it yours

- **Theme:** follows your page's light or dark mode automatically, or force
  `light` / `dark` / `auto`.
- **Brand colour:** set per company, or `accent: "#0f766e"` from your page.
- **Wording:** greeting, menu, answers, header status and the bot's questions
  come from a per-company file. No code change.
- **Placement:** bottom right or left, inline in your page, or a popup from
  your own button.

### 4.8 Security

- Each site that may embed the chat or console is registered, and the browser
  blocks everyone else (`frame-ancestors`).
- Agents sign in through your identity provider; Quokra checks the token, the
  role and team membership on every request.
- Customer identity is signed by your backend with a secret that never reaches
  the browser, and tokens live at most 5 minutes.
- Rate limits, blocked contacts, and messages always shown as plain text.

### 4.9 FAQ

- **Do I need to change my site's code?** One script tag for the chat. For the
  console, a few lines in your dashboard.
- **Does it work with my framework?** Yes: it's a script tag and an iframe, so
  any stack works.
- **Can customers chat without logging in?** Yes, as guests. They leave an
  email before talking to a person.
- **How do agents log in?** With your dashboard's existing login (OIDC).
- **Can I change the colours and texts?** Yes, per company, without code.
- **Is there AI?** Not yet. v1 answers from your FAQ; AI answers are planned.

### 4.10 Final CTA and footer

- CTA: "See it working" → "Try the demo" (`/login`).
- Footer: "Quokra Playground · powered by Quokra" with links: Quokra on GitHub,
  Embedding guide, API reference, and the existing template credit.

---

## 5. Links to use

| Label | URL |
|---|---|
| Quokra | https://github.com/mesubash/quokra |
| Embedding guide | https://github.com/mesubash/quokra/blob/main/docs/EMBEDDING.md |
| API reference | https://github.com/mesubash/quokra/blob/main/docs/API.md |
| Architecture | https://github.com/mesubash/quokra/blob/main/docs/ARCHITECTURE.md |

Both repos are private for now, so these links only work for people with
access. Keep them, but don't make them the main call to action; the demo is.

---

## 6. Facts to keep accurate

Say:
- FAQ bot from a per-company file (menu, keywords, urgent words, fallback).
- Human handoff in the same conversation, with email and name collected in chat.
- Customer chat: bubble, inline, popup. Agent console: full page or drawer.
- Agent login through the host's OIDC provider; customer identify with HS256
  tokens of at most 5 minutes.
- Light/dark following the host page, accent colour, per-company wording.
- Unread counts, search, notes, transfer, block, reopen, new-chat sound.

Don't say (not built yet):
- AI answers, or "AI-powered" anything.
- WhatsApp, email, Instagram or other channels.
- Analytics, reports or CSAT.
- A hosted SaaS, pricing, or sign-up.
- File attachments, canned replies, or business hours.

---

## 7. Implementation notes for this codebase

- The page is `src/app/landing/page.tsx`. Keep the data as arrays at the top
  (like `features`) and map them, as the file already does.
- Components: `Button`, `Card`, `Tabs`, `Badge`, `Accordion` (for the FAQ) are
  in `src/components/ui/`. Icons from `lucide-react`.
- Code blocks: a `<pre>` with `rounded-lg border bg-muted p-4 text-sm overflow-x-auto`
  is enough. No syntax-highlighting library is needed.
- The Quokra chat bubble already appears on the landing page for visitors
  (`src/components/quokra/quokra-widgets.tsx`). Leave room for it in the bottom-right
  corner, and don't change the files under `src/components/quokra/`,
  `src/lib/quokra.ts`, `src/app/support/` or `dev/`.
- Logo: `<Logo />` (`public/logo.png`).
- Screenshots worth adding (capture from the running demo, light and dark):
  the customer chat with a bot answer, the agent console with a conversation
  open, and the console drawer over the dashboard. Put them in `public/screens/`.
