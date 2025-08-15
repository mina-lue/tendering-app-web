export {default} from 'next-auth/middleware'


// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccess } from "./lib/RoleBasedRoutes";

const PUBLIC_ROUTES = [ "/signin", "/signup", "/api/auth", "/_next", "/favicon", "/public", '/signout', '/api/telebirr/createOrder'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));
  const token = await getToken({ req });
  const isAuthed = !!token;

  // Landing logic
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = isAuthed ? "/tenders" : "/signup";
    return NextResponse.redirect(url);
  }

  // Public routes allowed
  if (isPublic) return NextResponse.next();

  // Protect app routes
  if (!isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/not-allowed";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Role checks (only for app pages you care about)
  const role = (token.user.role || "VENDOR") as any;
  if (!canAccess(role, pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/tenders";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|images|assets).*)",
  ],
};
