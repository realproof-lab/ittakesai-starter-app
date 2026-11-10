import { NextResponse, type NextRequest } from "next/server";
import { appPassword, safeEqual, SESSION_COOKIE, sessionToken } from "./lib/session";

/** Every page needs the team password, except the sign-in and setup pages. */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/login" || pathname === "/setup") return NextResponse.next();

  const password = appPassword();
  if (!password) return NextResponse.redirect(new URL("/setup", request.url));

  const cookie = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  if (cookie && safeEqual(cookie, await sessionToken(password))) return NextResponse.next();

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  // Skip Next.js internals and static files.
  matcher: ["/((?!_next/|favicon.ico|robots.txt|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
