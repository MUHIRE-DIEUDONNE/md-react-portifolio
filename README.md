# React + Vite

## Supabase contact form

Copy `.env.example` to `.env.local` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`)

Find the Project URL and public anon/publishable key in the Supabase dashboard under
**Project Settings → API** (some dashboard versions label keys **API Keys**). These are
intended for frontend use; never put a `service_role` or secret key in a `VITE_` variable.
Vite embeds frontend variables in the built app, so keep `.env.local` local and restart
the dev server after changing it.

Run `supabase/migrations/20261124000000_create_contact_messages.sql` in the Supabase SQL
Editor. It creates the UUID-backed `contact_messages` table and grants the anonymous
role INSERT only, with row-level security enabled.

### Contact form troubleshooting

- **Wrong URL:** Copy the Project URL from **Project Settings → API**. It should be the
  project HTTPS URL, without extra path, query, or trailing copied text.
- **Key copied with spaces or incompletely:** Copy the full anon/public key, not the
  `service_role`/secret key. The app trims surrounding whitespace and reports malformed
  values before enabling submission.
- **RLS or permissions deny inserts:** Run the migration in the SQL Editor and check
  that `contact_messages` has RLS enabled, the anonymous INSERT policy exists, and the
  `anon` role has INSERT permission. Do not solve this by granting public SELECT.
- **CORS/network errors:** Open browser developer tools → Network and inspect the
  request to the project's `/rest/v1/contact_messages` endpoint. Check the browser
  console for blocked requests, extensions, proxies, or custom-domain CORS settings.
- **Table/column mismatch:** Confirm the exact lowercase table name `contact_messages`
  and columns `name`, `email`, `subject`, and `message`. Postgres quoted mixed-case
  names are different.
- **Paused project:** Open the Supabase dashboard and resume the project if it is
  paused, then retry after its API is available.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
