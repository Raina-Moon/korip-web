import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";

let locales = ["en", "ko"];
let defaultLocale = "en";

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locale = match(languages, locales, defaultLocale);
  return locale;
}

const routes = ["/profile"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // Authentication logic
  if (routes.some((route) => pathname.startsWith(route)) && !refreshToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Internationalization logic
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const locale = getLocale(req);
  req.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|locales).*) traditions",
  ],
};