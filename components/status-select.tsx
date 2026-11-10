"use client";

import { useTransition } from "react";
import { setStatus } from "@/app/actions";
import { STATUSES } from "@/app.config";

export function StatusSelect({ id, status, label }: { id: number; status: string; label: string }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label={`Status of ${label}`}
      defaultValue={status}
      disabled={pending}
      onChange={(e) => start(() => setStatus(id, e.target.value))}
      className="h-9 rounded-md border border-stone-300 bg-white px-2 text-sm disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
