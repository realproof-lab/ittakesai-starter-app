import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateItem } from "@/app/actions";
import { APP, STATUSES } from "@/app.config";
import { AiSummary } from "@/components/ai-summary";
import { DeleteButton } from "@/components/delete-button";
import { getDb } from "@/db";
import { items } from "@/db/schema";
import { aiEnabled } from "@/lib/ai";

export const dynamic = "force-dynamic";

const input = "h-11 rounded-lg border border-stone-300 bg-white px-3 outline-none focus:border-stone-900";

export default async function ItemPage(props: PageProps<"/items/[id]">) {
  const db = getDb();
  if (!db) redirect("/setup");

  const { id } = await props.params;
  const { error } = await props.searchParams;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();

  const [item] = await db.select().from(items).where(eq(items.id, itemId));
  if (!item) notFound();

  const save = updateItem.bind(null, item.id);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 px-5 py-8">
      <Link href="/" className="text-sm text-stone-600 underline underline-offset-2 hover:text-stone-900">
        Back to all {APP.itemPlural}
      </Link>
      <h1 className="text-2xl font-semibold">Edit {APP.itemSingular}</h1>

      <form action={save} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Title
          <input name="title" required defaultValue={item.title} className={input} />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Owner
            <input name="owner" defaultValue={item.owner ?? ""} className={input} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Due date
            <input name="dueDate" type="date" defaultValue={item.dueDate ?? ""} className={input} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Status
            <select name="status" defaultValue={item.status} className={input}>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Notes
          <textarea
            name="notes"
            rows={6}
            defaultValue={item.notes ?? ""}
            className="rounded-lg border border-stone-300 bg-white p-3 outline-none focus:border-stone-900"
          />
        </label>
        {typeof error === "string" ? <p className="text-sm text-red-700">{error}</p> : null}
        <div className="flex gap-3">
          <button type="submit" className="h-11 flex-1 rounded-lg bg-stone-900 font-medium text-white hover:bg-stone-700">
            Save
          </button>
          <DeleteButton id={item.id} label={item.title} />
        </div>
      </form>

      {aiEnabled() ? (
        <AiSummary id={item.id} hasNotes={Boolean(item.notes?.trim())} />
      ) : (
        <p className="text-sm text-stone-500">
          AI summary is off. To switch it on, add ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables, then
          redeploy.
        </p>
      )}
    </main>
  );
}
