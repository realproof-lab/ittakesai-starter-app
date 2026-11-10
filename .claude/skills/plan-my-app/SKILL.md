---
name: plan-my-app
description: Interviews a non-programmer about their app idea and writes a one-page SPEC.md mapped onto this starter app, keeping version one tiny. Use when someone describes an idea.
---

# Plan my app

Beginners usually describe the whole dream at once. The fastest way to a working tool is to agree on a tiny first version that fits the starter app, ship it, and grow from there. This skill turns an idea into that first version on one page.

## Interview, briefly

Ask these in one message, in plain words, and let the person answer loosely:

1. Who will use it, and how many people?
2. What is the one list or thing it keeps track of? (candidates, requests, clients, orders...)
3. For each of those things, what do you need to see? (name, who owns it, a date, a status...)
4. What steps does one go through from start to finish?
5. What does a good day with this tool look like? What do you do in it?

If they've already said most of this, don't ask again; confirm what you understood instead.

## Shrink it

Pick what goes in version one: one list, its fields, its statuses, the main screen and the edit screen. Everything else goes under "Later". A good first version can be built in an afternoon by changing the starter app, not rewriting it. Say plainly what you left out and why ("Email reminders are a great idea; let's add them once the list works").

## Map it onto the starter app

The starter app already has: one list (`items`), title, owner, due date, notes, statuses, filters by status, add and edit forms, a team password. Show how their idea maps onto that:

- rename "item" to their word, and the app name and tagline (`app.config.ts`)
- rename statuses to their steps
- fields to keep, rename or add (database changes go through the `change-the-data` skill)

## Write SPEC.md

Create `SPEC.md` in the repo root:

```
# [App name]

Who uses it: ...
What it tracks: one [thing] per row

## Fields
| Field | Type | Example | Required |

## Steps (statuses)
1. ...

## Screens
- Main list: ...
- Edit page: ...

## Version one changes to the starter app
1. ...

## Later
- ...
```

Then show the person the plan in a short summary, ask "Shall I build version one?", and when they say yes, build it change by change with the `make-a-change` and `change-the-data` skills.
