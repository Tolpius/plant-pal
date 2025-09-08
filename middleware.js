// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  //Plant edit page gets redirected --> Login Page --> then redirect to requested page
  if (pathname.startsWith("/plants/") && pathname.endsWith("/edit")) {
    if (!token) {
      const signInUrl = new URL("/api/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
    if (token.role !== "admin")
      return NextResponse.redirect(new URL("/catalogue", req.url));
  }

  // Admin routes: only accessible for users with role 'admin'
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const signInUrl = new URL("/api/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
    if (token.role !== "admin") {
      // Optional: redirect to forbidden page (to be implemented)
      return NextResponse.redirect(new URL("/catalogue", req.url));
    }
  }

  // Homepage and detailsPage free
  if (pathname === "/" || pathname.startsWith("/plants/")) {
    return NextResponse.next();
  }

  // Every other side --> Login Page --> then redirect to requested page
  if (!token) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
//Matcher watches every page route, but excludes API, next.js intern, favicon.ico, pictures, etc.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
