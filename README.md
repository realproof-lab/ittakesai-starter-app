# Team tracker

A small web app for your team: a shared list of items with status, owner, due date and notes, behind one team password. It's a starting point: reshape it into your own tool by asking Claude Code.

From the **it takes AI Build Pack**. Start with the guide, `01 START HERE.pdf`.

## Settings it needs (in Vercel → Settings → Environment Variables)

| Name | What |
|---|---|
| `DATABASE_URL` | Set automatically when you connect Neon in Vercel → Storage |
| `APP_PASSWORD` | The password your team types to get in |

Until both are set, the app shows a setup page that says what to click.

## For Claude Code

See `CLAUDE.md`.
