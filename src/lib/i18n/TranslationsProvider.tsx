"use client";

import { ReactNode } from "react";

export default function TranslationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
