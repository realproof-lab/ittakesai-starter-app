"use client";

import { useActionState } from "react";
import { summarizeNotes, type SummaryState } from "@/app/actions";

const initial: SummaryState = { summary: null, error: null };

/** The AI summary box on the edit page. Each click is one request to Claude, billed to the Claude API account. */
export function AiSummary({ id, hasNotes }: { id: number; hasNotes: boolean }) {
  const [state, action, pending] = useActionState(summarizeNotes.bind(null, id), initial);
  const bullets = state.summary
    ?.split("\n")
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium">AI summary</h2>
        <form action={action}>
          <button
            type="submit"
            disabled={pending || !hasNotes}
            className="h-11 rounded-lg border border-stone-300 px-4 text-sm font-medium hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Summarizing…" : state.summary ? "Summarize again" : "Summarize notes"}
          </button>
        </form>
      </div>
      <div aria-live="polite" className="flex flex-col gap-2 text-sm">
        {bullets?.length ? (
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {bullets.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : null}
        {state.error ? <p className="text-red-700">{state.error}</p> : null}
        {!bullets?.length && !state.error ? (
          <p className="text-stone-500">
            {hasNotes ? "Turns the saved notes into three bullet points." : "Add notes and save to get a summary."}
          </p>
        ) : null}
      </div>
    </section>
  );
}
