# CLAUDE.md

@AGENTS.md

## Who you're working with

The owner of this repo is **not a programmer**. They are building a tool for their own team. So:

- Explain everything in plain English. No jargon without a one-line explanation.
- Make one change at a time, then tell them in two or three sentences what changed and exactly how to see it.
- Ask before anything risky: deleting data, removing a field, changing the password lock.
- When they describe what they want, restate it in one line before building, so misunderstandings are caught early.

## What this app is

A small web app that started as a **team tracker**: a list of items with title, status, owner, due date and notes, behind a shared team password. The owner will reshape it into their own tool (an onboarding checklist, a content approval queue, a candidate pipeline...). `app.config.ts` holds the name, wording and statuses.

## Stack

- **Next.js 16, App Router.** It differs from older Next.js: read `AGENTS.md` and the docs in `node_modules/next/dist/docs/` before writing code. Middleware is now `proxy.ts`. `params` and `searchParams` are Promises.
- **Tailwind CSS 4** for styling.
- **Postgres** through **Drizzle ORM**. In production the database is Neon, connected through Vercel, which sets `DATABASE_URL`.
- **Server actions** in `app/actions.ts` for every change to data.
- **Hosting:** Vercel. Every push to `main` deploys to the live site; every pull request gets a preview link.

## Files

| Path | What it is |
|---|---|
| `app.config.ts` | App name, wording, statuses. Change these first when reshaping the app |
| `db/schema.ts` | Database tables |
| `drizzle/` | Migrations, generated from the schema. Never edit by hand |
| `scripts/migrate.mjs` | Runs migrations before each build (skips if no database is connected) |
| `app/page.tsx` | The main list, filters and add form |
| `app/items/[id]/page.tsx` | Edit page |
| `app/actions.ts` | Server actions: sign in/out, add, update, delete |
| `proxy.ts`, `lib/session.ts` | The team password lock |
| `app/login`, `app/setup` | Sign-in page and the setup help page |

## Rules

1. **Secrets never go in the repo.** Passwords, keys and database URLs live in Vercel → Settings → Environment Variables. Never commit `.env` files.
2. **Database changes:** edit `db/schema.ts`, then run `npm run db:generate` and commit the new file in `drizzle/`. Never edit or delete existing migration files. Prefer adding fields over renaming or removing them; never drop a column or table that may hold data without the owner's explicit yes.
3. **Keep the lock working.** Every page stays behind `proxy.ts`, and every new server action starts with `await requireSession()`.
4. **Keep it simple.** Plain layouts, real form labels, works on a phone. No new libraries unless they clearly save work; say why when you add one.
5. **Before you say you're done:** `npm run lint` and `npm run build` both pass. If a database is available in your environment, also try the change against it.
6. **Ship through pull requests.** Work on a branch and open a pull request. The owner opens the preview link, checks it, and merges. Merging puts it live.

## Skills in this repo

Use them; they hold the step-by-step for the common jobs:

| Skill | When |
|---|---|
| `plan-my-app` | The owner describes an idea or wants to turn the tracker into their own tool |
| `make-a-change` | Any change to how the app looks or works |
| `change-the-data` | Adding, renaming or removing fields, statuses or lists |
| `fix-what-broke` | An error, a failed deploy, or "it doesn't work" |
| `ship-it` | Getting a change live and checking it |
| `add-payments` | Taking money with Stripe |
