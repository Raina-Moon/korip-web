"use client";

import { usePathname, useSearchParams } from "next/navigation";

export const useRedirectPath = (locale: string) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.toString();
  const fullPath = search ? `${pathname}?${search}` : pathname;

  const redirectPath = fullPath.replace(`/${locale}`, "");

  return redirectPath;
};
