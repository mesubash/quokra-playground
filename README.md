# Quokra Playground

A minimal admin dashboard for testing ideas against a realistic UI.

Built with React 19, Vite, TypeScript, Tailwind CSS v4 and shadcn/ui.

## Pages

- **Landing** (`/`): marketing page with a sign-in call to action
- **Login** (`/login`): mock sign-in, any email and password works.
  The session is stored in `localStorage` (see `src/lib/auth.ts`); signed-out
  visitors are sent to `/login`. Log out sits in the header and the user menu.
- **Dashboard**: stat cards, an area chart and a data table
- **Users**: user table with add/edit dialog
- **Mail**: inbox with a reading pane
- **Chat**: conversation list and messages
- **Settings**: user, account, appearance and notifications

The pages use sample data from local JSON files under `src/app/*/data`.

## Getting started

Requires Node 20.19+ (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm build     # type-check and build to dist/
pnpm lint
```

## Quokra (branch `quokra`)

This branch embeds [Quokra](https://github.com/mesubash/quokra) the way a real app would:

- **Visitors and customers** get the Quokra chat bubble on every page. Signed-in
  customers are identified, so the support team sees who they are.
- **Agents** get a **Support** page with the full console, and the console bubble
  on every other page.

Sign in as a customer (any email) or as a demo agent (Sam or Alex). Open both in
two windows, or one in a private window, to see the chat live.

### Running it

1. Start Quokra locally with the dev profile (see Quokra's `docs/DEVELOPMENT.md`).
   Its dev data already allows `http://localhost:5173` and has both demo agents.
2. `cp .env.example .env.local` (the defaults match Quokra's dev setup).
3. `pnpm dev`

### How the tokens work

Quokra needs two tokens that a real app's backend provides. Here a small dev
backend inside the Vite server stands in for it (`dev/quokra-api.ts`):

- `POST /api/quokra/identity`: signs a 5-minute identity token for the signed-in
  customer with `QUOKRA_SECRET_KEY`. The key stays on the server side.
- `POST /api/quokra/agent-token`: gets an agent token from Quokra's dev endpoint.
  A real dashboard would pass on the access token from its own login (OIDC).

The browser side is in `src/lib/quokra.ts`, `src/components/quokra/` and
`src/app/support/`.

## Project layout

```
src/
  app/          one folder per page (page.tsx, components/, data/)
  components/   layout, sidebar, header and shadcn/ui components (ui/)
  config/       routes
  contexts/     theme and sidebar state
  hooks/        shared hooks
```

To add a page, create `src/app/<name>/page.tsx`, register it in
`src/config/routes.tsx`, and link it from `src/components/app-sidebar.tsx`.

## Credits

Based on [shadcn-dashboard-landing-template](https://github.com/shadcnstore/shadcn-dashboard-landing-template)
by [ShadcnStore](https://shadcnstore.com), trimmed down to the dashboard, a few
apps and settings.

## License

MIT. See [License.md](License.md).
