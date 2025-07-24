"use client";

import { usePathname, useSearchParams } from "next/navigation";

export const useRedirectPath = (locale: string) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.toString();
  const fullPath = search ? `${pathname}?${search}` : pathname;

  const redirectPath = fullPath.replace(`/${locale}`, "");

  if (!isValidRedirectPath(redirectPath)) {
    return "/";
  }

  return redirectPath;
};

export const isValidRedirectPath = (path: string) => {
  return (
    path !== "/login" &&
    path !== "/signup" &&
    !path.startsWith("/login") &&
    !path.startsWith("/signup")
  );
};
