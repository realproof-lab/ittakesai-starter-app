import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/** Vercel's Neon integration sets DATABASE_URL (and POSTGRES_URL as an alias). */
export const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";

type Db = ReturnType<typeof drizzle<typeof schema>>;
const globalForDb = globalThis as unknown as { db?: Db };

/** Returns the database, or null when none is connected yet (the app shows a setup screen). */
export function getDb(): Db | null {
  if (!databaseUrl) return null;
  if (!globalForDb.db) {
    const pool = new Pool({ connectionString: databaseUrl, max: 5 });
    globalForDb.db = drizzle(pool, { schema });
  }
  return globalForDb.db;
}
