// Runs database migrations before each build, so a deploy always has the tables it needs.
// Without a database connected yet it does nothing, and the app shows a setup screen instead.
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!url) {
  console.log("[migrate] No DATABASE_URL yet: skipping migrations. Connect Neon in Vercel → Storage.");
  process.exit(0);
}

const pool = new pg.Pool({ connectionString: url, max: 1 });
try {
  await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
  console.log("[migrate] Database is up to date.");
} catch (err) {
  console.error("[migrate] Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
