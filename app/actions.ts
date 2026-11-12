"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { STATUSES } from "@/app.config";
import { getDb } from "@/db";
import { items } from "@/db/schema";
import { appPassword, safeEqual, safeNextPath, SESSION_COOKIE, SESSION_DAYS, sessionToken } from "@/lib/session";

const statusIds = STATUSES.map((s) => s.id) as [string, ...string[]];

const itemInput = z.object({
  title: z.string().trim().min(1, "Give it a title").max(200),
  status: z.enum(statusIds).default("todo"),
  owner: z.string().trim().max(100).optional().transform((v) => v || null),
  dueDate: z
    .string()
    .optional()
    .transform((v) => v || null)
    .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use a valid date"),
  notes: z.string().trim().max(5000).optional().transform((v) => v || null),
});

/** Server actions are public endpoints, so each one checks the team session itself too. */
async function requireSession() {
  const password = appPassword();
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  if (!password || !cookie || !safeEqual(cookie, await sessionToken(password))) redirect("/login");
}

function db() {
  const database = getDb();
  if (!database) redirect("/setup");
  return database;
}

function fields(formData: FormData) {
  return itemInput.safeParse({
    title: formData.get("title") ?? "",
    status: formData.get("status") ?? undefined,
    owner: formData.get("owner") ?? undefined,
    dueDate: formData.get("dueDate") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
}

export async function signIn(formData: FormData) {
  const password = appPassword();
  const typed = String(formData.get("password") ?? "");
  const safeNext = safeNextPath(formData.get("next"));

  if (!password) redirect("/setup");
  if (!safeEqual(await sessionToken(typed), await sessionToken(password))) {
    redirect(`/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }
  (await cookies()).set(SESSION_COOKIE, await sessionToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  redirect(safeNext);
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

export async function addItem(formData: FormData) {
  await requireSession();
  const parsed = fields(formData);
  if (!parsed.success) redirect(`/?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  await db().insert(items).values(parsed.data);
  revalidatePath("/");
}

export async function updateItem(id: number, formData: FormData) {
  await requireSession();
  const parsed = fields(formData);
  if (!parsed.success) redirect(`/items/${id}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  await db()
    .update(items)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(items.id, id));
  revalidatePath("/");
  redirect("/");
}

export async function setStatus(id: number, status: string) {
  await requireSession();
  if (!statusIds.includes(status)) return;
  await db().update(items).set({ status, updatedAt: new Date() }).where(eq(items.id, id));
  revalidatePath("/");
}

export async function deleteItem(id: number) {
  await requireSession();
  await db().delete(items).where(eq(items.id, id));
  revalidatePath("/");
  redirect("/");
}
