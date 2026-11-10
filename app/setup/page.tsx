import Link from "next/link";
import { APP } from "@/app.config";
import { databaseUrl } from "@/db";
import { appPassword } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Shown until the database and the team password are set in Vercel. */
export default function SetupPage() {
  const hasPassword = Boolean(appPassword());
  const hasDatabase = Boolean(databaseUrl);
  const steps = [
    {
      done: hasDatabase,
      title: "Connect a database",
      how: "In Vercel, open this project → Storage → Create Database → Neon → Connect. Then redeploy.",
    },
    {
      done: hasPassword,
      title: "Set the team password",
      how: "In Vercel, open this project → Settings → Environment Variables → add APP_PASSWORD with a password your team will share. Then redeploy.",
    },
  ];

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-2xl font-semibold">{APP.name}: almost ready</h1>
        <p className="mt-1 text-stone-600">Two settings in Vercel, then your app is live and private.</p>
      </div>
      <ol className="flex flex-col gap-3">
        {steps.map((step) => (
          <li key={step.title} className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="font-medium">
              {step.done ? "✓ " : ""}
              {step.title}
              <span className={`ml-2 text-sm ${step.done ? "text-green-700" : "text-amber-700"}`}>
                {step.done ? "done" : "to do"}
              </span>
            </p>
            {!step.done ? <p className="mt-1 text-sm text-stone-600">{step.how}</p> : null}
          </li>
        ))}
      </ol>
      {hasPassword && hasDatabase ? (
        <Link href="/" className="h-11 rounded-lg bg-stone-900 text-center leading-[44px] font-medium text-white">
          Open the app
        </Link>
      ) : null}
    </main>
  );
}
