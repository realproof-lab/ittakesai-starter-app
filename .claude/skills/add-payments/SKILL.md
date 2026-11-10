---
name: add-payments
description: Adds Stripe payments to the app the simplest safe way - Payment Links first, Checkout only if needed - always in test mode first, with keys only in Vercel. Use when someone wants to charge money.
---

# Add payments

Taking money is easy to get wrong in ways that cost money. Start with the option that needs the least code, test everything in Stripe's test mode, and keep secret keys out of the code.

## First, check they're allowed to

If the app takes payments it's a commercial project. Vercel's free Hobby plan is for personal, non-commercial use only, so they'll need Vercel Pro. Their Stripe account also needs to be set up for the business that sells. Say this before writing any code.

## Pick the simplest option

1. **Payment Links (no code in the app).** For fixed prices: create the product and a Payment Link in the Stripe dashboard, then add a "Pay" button in the app that links to it. Stripe handles checkout, receipts and tax settings. Good enough for most first apps.
2. **Stripe Checkout (some code).** Only if the price depends on what's in the app (a custom amount, a quantity, a per-item price). A server action creates a Checkout Session and redirects to it; a webhook route records paid orders in the database.

Explain the choice in one sentence and confirm before building option 2.

## Rules

- **Test mode first.** Use test keys and Stripe's test card numbers (4242 4242 4242 4242, any future date, any CVC) until the whole flow works.
- **Keys live in Vercel** environment variables: `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` if you add a webhook. Never in code, never in the repo. The owner pastes them into Vercel themselves.
- **Never trust the browser** for "this was paid". Record a payment only from a verified webhook or by retrieving the session from Stripe on the server.
- **Webhook route:** verify the signature with the webhook secret; make it safe to receive the same event twice.
- Add a database table for orders through the `change-the-data` skill if you need to keep records.

## When it works in test mode

Tell the owner how to switch to live: create live-mode products or links, put the live keys in Vercel for Production only, redeploy, then make one small real payment and refund it.
