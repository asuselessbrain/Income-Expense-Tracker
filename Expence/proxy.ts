import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const user = await getCurrentUser()

  const isAuthenticated = !!user;

  const isPublicRoute = pathname === "/login" || pathname === "/register";

  if(isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if(!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}