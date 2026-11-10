"use client";

import { deleteItem } from "@/app/actions";

export function DeleteButton({ id, label }: { id: number; label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm(`Delete "${label}"? This can't be undone.`)) void deleteItem(id);
      }}
      className="h-11 rounded-lg border border-red-300 px-4 font-medium text-red-700 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
