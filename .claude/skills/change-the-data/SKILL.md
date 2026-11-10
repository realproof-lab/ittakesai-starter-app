---
name: change-the-data
description: Adds, renames or removes fields, statuses and lists safely: edit db/schema.ts, generate a migration, update the screens, never delete data without asking. Use for any database change.
---

# Change the data

The data in this app is the team's real work. A careless database change can wipe it. This skill makes changes in a way that keeps existing data safe and deploys cleanly.

## How the database works here

- Tables are defined in `db/schema.ts` (Drizzle ORM).
- `npm run db:generate` compares the schema with the existing migrations and writes a new SQL migration into `drizzle/`.
- On every deploy, `scripts/migrate.mjs` applies new migrations before the build. So committing the migration is what changes the live database.

## Steps

1. **Edit `db/schema.ts`.**
   - New field: add it as nullable, or with a sensible default, so existing rows stay valid. (`priority: text("priority").notNull().default("medium")`)
   - New list: add a new table, with `id`, timestamps, and a reference to related rows if needed.
2. **Run `npm run db:generate`** and read the SQL it produced. Check it does what you expect and nothing more.
3. **Update the app:** the add form, the edit page, the list display, and the validation in `app/actions.ts` (the zod schema). Server actions keep their `requireSession()` call.
4. **Check:** `npm run lint` and `npm run build`. If a Postgres database is available in your environment, run the migration against it (`DATABASE_URL=... npm run db:migrate`) and try the screens.
5. **Explain** to the owner what changed, and whether existing items got a default value.

## Changes that can lose data: ask first

- **Removing** a field or table deletes what's in it, permanently.
- **Renaming** a field can look like "delete + add" to the migration tool, which also loses data. If `db:generate` asks whether a column was renamed or created, choose rename, and read the generated SQL to confirm it says `RENAME COLUMN`.
- **Changing a type** (text to number) can fail on existing values.

Migrations also run when Vercel builds a pull request's preview. Unless the owner has turned on Neon database branches for previews (Vercel → Storage → the Neon database → its settings), the preview uses the **live** database, so the migration reaches live data before anyone merges. Adding fields is harmless that way. For a rename or removal, ask the owner to turn preview branches on first, or do it in two pull requests: add the new field and copy values over, then remove the old one later.

For any of these, explain the risk in one sentence and get an explicit yes. Offer the safer option: hide a field from the screens instead of deleting it, or add a new field and copy values across.

Statuses are stored as ids (`todo`, `doing`, `done`). Changing a status *label* in `app.config.ts` is always safe. Changing or removing an *id* needs existing rows updated first; write that as a migration too.

Never edit or delete files that are already in `drizzle/`. Never run destructive SQL by hand against the live database.
