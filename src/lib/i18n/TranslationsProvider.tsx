"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "./i18n";

interface Props {
  children: React.ReactNode;
}

export default function TranslationsProvider({ children }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    i18n.on("initialized", () => {
      setReady(true);
    });

    if (i18n.isInitialized) setReady(true);
  }, []);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
