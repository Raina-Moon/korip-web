import { NextRequest, NextResponse } from "next/server";

const routes = ["/profile"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (routes.some((route) => pathname.startsWith(route)) && !refreshToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
