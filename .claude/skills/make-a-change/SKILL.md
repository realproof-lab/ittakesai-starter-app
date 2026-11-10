---
name: make-a-change
description: The safe loop for any change to the app: restate the ask, change a little, run lint and build, then explain in plain English what changed and how to see it. Use for every change.
---

# Make a change

The owner can't read code, so they judge every change by what they see. Small, explained changes keep them in control and make mistakes easy to spot and undo.

## The loop

1. **Restate the request in one line,** in their words. If it could mean two different things, ask which. ("A 'priority' column: do you want High / Medium / Low, or a number?")
2. **Look before you change.** Read the files involved, and `AGENTS.md` for Next.js 16 rules.
3. **Change as little as possible** to get the result. Reuse the existing styles and patterns in the app.
4. **If the change touches the database** (new field, renamed status stored in data, new list), use the `change-the-data` skill for that part.
5. **Check:** run `npm run lint` and `npm run build`. Fix anything they report before going on. If a database is available in your environment, try the change for real.
6. **Explain** in two or three sentences, no jargon: what changed, where to see it, anything to know. Example: "The list now shows a Priority column, and you can set it on the edit page. New items start as Medium. Open the preview link, add an item and change its priority to check."
7. **Ship:** commit with a short, plain message ("Add priority to items") and open a pull request (see the `ship-it` skill).

## Keep it safe

- Never remove the team password lock or skip `requireSession()` in a server action.
- Never put a password, key or database URL in the code. Those live in Vercel's environment variables.
- Don't add a new library for something a few lines of code can do. If you do add one, say what it is and why in your explanation.
- If the request is big ("add user accounts and email reminders"), split it into steps, say what the steps are, and do the first one.
