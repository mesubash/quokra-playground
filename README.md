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
