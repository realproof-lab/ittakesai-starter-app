---
name: fix-what-broke
description: Diagnoses and fixes errors, like failed Vercel builds or broken pages: reads the real error, finds the cause, makes the smallest fix, explains it simply. Use when something breaks.
---

# Fix what broke

When something breaks, a beginner usually has a screenshot and a bad feeling. This skill finds the real cause, fixes it with the smallest change, and explains it in a way that makes the next problem less scary.

## Get the real error

Ask for the most useful thing the person can give you, in plain words:
- **Failed deploy:** in Vercel, open the failed deployment and copy the red lines from the build log. Or a screenshot.
- **Error page in the app:** the exact page address and what they clicked.
- **"It doesn't work":** what they expected, and what happened instead.

Then reproduce it yourself: run `npm run build` and `npm run lint`, read the relevant files, and if a database is available, run the app.

## Common causes in this app

| Symptom | Usual cause |
|---|---|
| App shows the setup page | `DATABASE_URL` or `APP_PASSWORD` missing in Vercel, or set but not redeployed |
| Build fails at "[migrate]" | A migration can't apply: a new required field without a default, or a type change on existing data |
| Build fails with a type error | Code doesn't match the schema after a change, or Next.js 16 API differences (async `params`/`searchParams`) |
| Changes saved but don't show | A missing `revalidatePath("/")` after a server action |
| Works in preview, not live | An environment variable set only for Preview, not Production |
| Everyone signed out | `APP_PASSWORD` was changed (expected) |

## Fix

1. Make the **smallest change** that removes the cause. Don't refactor while fixing.
2. Check with `npm run lint` and `npm run build`.
3. Explain in plain words: what broke, why, what you changed, and how to avoid it next time.
4. Ship through a pull request (`ship-it` skill).

If the live site is broken right now and the fix will take a while, tell the person how to undo the last deploy in Vercel first: Deployments → the last working deployment → **Instant Rollback**. Fix calmly afterwards.

Never "fix" an error by removing the password lock, deleting migrations, or wiping data.
