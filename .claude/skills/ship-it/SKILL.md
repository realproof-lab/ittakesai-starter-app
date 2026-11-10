---
name: ship-it
description: Gets a finished change live: checks pass, a clear commit, a pull request with a plain summary, the preview check, merge, then a live check and how to undo. Use when a change is ready.
---

# Ship it

Shipping is where beginners get nervous. A predictable routine makes it boring, which is the goal: check, preview, publish, confirm.

## Before

- `npm run lint` and `npm run build` pass.
- Any database change has its migration committed in `drizzle/`.
- No secrets in the diff.

## Ship

1. **Commit** on a branch with a short, plain message: "Add priority to items", not "update stuff".
2. **Open a pull request.** Title in plain words. In the description write, for the owner:
   - what changed (2–3 bullets they can understand)
   - how to check it on the preview link (exact clicks)
   - anything that changes for the team (a new field everyone should fill in, a renamed status)
3. **The preview.** Vercel builds every pull request and posts a preview link on it. Ask the owner to open it and try the change. A preview may use a separate preview database branch, or the main database if preview branches aren't on, so test with throwaway items and delete them after.
4. **Publish.** When the owner is happy, they click **Merge** on GitHub. Vercel then deploys to the live address in a minute or two.
5. **Confirm live.** Ask them to open the live app and check the change once more.

## If it goes wrong after publishing

In Vercel: **Deployments → the last good deployment → Instant Rollback**. The live site goes back immediately; then use the `fix-what-broke` skill. Note that rollback doesn't undo database migrations, which is another reason migrations should only add, not remove.

## Tell the owner

End with one line: what's live now, and what you suggest doing next.
