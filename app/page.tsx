import { asc, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { addItem, signOut } from "@/app/actions";
import { APP, STATUSES } from "@/app.config";
import { StatusSelect } from "@/components/status-select";
import { getDb } from "@/db";
import { items } from "@/db/schema";

export const dynamic = "force-dynamic";

const input = "h-11 rounded-lg border border-stone-300 bg-white px-3 outline-none focus:border-stone-900";

export default async function Home(props: PageProps<"/">) {
  const db = getDb();
  if (!db) redirect("/setup");

  const { status, error } = await props.searchParams;
  const filter = STATUSES.find((s) => s.id === status)?.id;

  const rows = await db
    .select()
    .from(items)
    .where(filter ? eq(items.status, filter) : undefined)
    .orderBy(asc(sql`${items.dueDate} is null`), asc(items.dueDate), desc(items.createdAt));

  const today = new Date().toISOString().slice(0, 10);
  const doneId = STATUSES[STATUSES.length - 1].id;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{APP.name}</h1>
          <p className="mt-1 text-stone-600">{APP.tagline}</p>
        </div>
        <form action={signOut}>
          <button type="submit" className="text-sm text-stone-600 underline underline-offset-2 hover:text-stone-900">
            Sign out
          </button>
        </form>
      </header>

      <form action={addItem} className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4">
        <label htmlFor="title" className="text-sm font-medium">
          New {APP.itemSingular}
        </label>
        <input id="title" name="title" required placeholder="What needs doing?" className={input} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input name="owner" placeholder="Owner" aria-label="Owner" className={input} />
          <input name="dueDate" type="date" aria-label="Due date" className={input} />
          <select name="status" aria-label="Status" className={input} defaultValue={STATUSES[0].id}>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {typeof error === "string" ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="h-11 rounded-lg bg-stone-900 font-medium text-white hover:bg-stone-700">
          Add {APP.itemSingular}
        </button>
      </form>

      <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
        {[{ id: undefined, label: "All" }, ...STATUSES].map((s) => (
          <Link
            key={s.label}
            href={s.id ? `/?status=${s.id}` : "/"}
            aria-current={filter === s.id ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm ${
              filter === s.id ? "bg-stone-900 text-white" : "bg-white text-stone-700 ring-1 ring-stone-200"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-600">
          No {APP.itemPlural} here yet. Add your first one above.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {rows.map((item) => {
            const overdue = item.dueDate && item.dueDate < today && item.status !== doneId;
            return (
              <li key={item.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/items/${item.id}`} className="font-medium hover:underline">
                    {item.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-stone-600">
                    {item.owner ?? "No owner"}
                    {item.dueDate ? (
                      <span className={overdue ? "text-red-700" : ""}>
                        {" · due "}
                        {item.dueDate}
                        {overdue ? " (overdue)" : ""}
                      </span>
                    ) : null}
                  </p>
                </div>
                <StatusSelect id={item.id} status={item.status} label={item.title} />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
