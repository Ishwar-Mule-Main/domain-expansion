import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/admin/login");
  const isProtectedPage = 
    req.nextUrl.pathname.startsWith("/admin") || 
    req.nextUrl.pathname.startsWith("/studio");

  if (isProtectedPage && !isLoggedIn && !isAuthPage) {
    // Redirect unauthenticated users to the admin login page
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isAuthPage && isLoggedIn) {
    // Redirect authenticated admins away from login page to the dashboard
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: ["/admin/:path*", "/studio/:path*"],
};
