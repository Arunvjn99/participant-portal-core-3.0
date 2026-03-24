# Participant portal

React + TypeScript + Vite app for retirement / enrollment flows with optional Supabase auth and data.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment (optional for local UI)**

   Copy or create a `.env` file in the project root (Vite reads `VITE_*` variables from `.env`, `.env.local`, etc.).

3. **Run the dev server**

   ```bash
   npm run dev
   ```

4. **Production build**

   ```bash
   npm run build
   ```

## Environment variables

| Variable | Required for real auth / API | Description |
|----------|------------------------------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL (Settings → API → Project URL). |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous (public) key. |

If either value is missing or still looks like a placeholder, the app logs a console warning and exports a `null` Supabase client. The shell and most screens still load so you can use **Explore Demo** and static UI paths.

Do not commit real secrets; use `.env.local` (gitignored in typical setups) or your host’s env UI (e.g. Netlify).

## Demo mode (no backend)

When Supabase is not configured:

- The app **does not crash** on startup.
- **Login** shows: *Running in demo mode (no backend)* and disables email/password sign-in until env is set.
- **Signup** shows the same idea and disables submit.
- **Auth context** skips session subscription; `signIn` / `signUp` throw `Supabase not configured` if called from code paths that bypass the UI guards.
- Data services that need Supabase return empty or safe fallbacks where implemented (see `src/lib/supabase.ts` and callers).

Configure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with real project values to enable full auth and database features.

---

## Vite template notes

This project started from the Vite React + TS template. For ESLint expansion and React Compiler notes, see the [Vite React guide](https://vite.dev/guide/) and [React Compiler docs](https://react.dev/learn/react-compiler/installation).
