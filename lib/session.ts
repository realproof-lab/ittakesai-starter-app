/**
 * The team password lock. Everyone on the team shares one password (APP_PASSWORD in Vercel).
 * After signing in, the browser keeps a cookie whose value is derived from the password,
 * so changing the password signs everyone out.
 *
 * Uses Web Crypto so it runs both in proxy.ts and in server actions.
 */
export const SESSION_COOKIE = "team_session";
export const SESSION_DAYS = 30;

export function appPassword(): string {
  return process.env.APP_PASSWORD ?? "";
}

export async function sessionToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("team-session-v1"));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time comparison, so response timing doesn't leak how close a guess was. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Where to send someone after they sign in: only a path on this app, never another site.
 * Browsers read "/\\evil.com" and "/\t/evil.com" as "//evil.com", so checking that the text starts
 * with "/" isn't enough. Parse it the way a browser would and keep it only if it stays on this app.
 */
export function safeNextPath(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/")) return "/";
  const base = "http://app.invalid";
  try {
    const url = new URL(next, base);
    if (url.origin !== base) return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}
