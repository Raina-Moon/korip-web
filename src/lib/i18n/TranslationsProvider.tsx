"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "./i18n";
import { useParams } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function TranslationsProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const params = useParams();
  const locale = Array.isArray(params.locale)
    ? params.locale[0]
    : params.locale;

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    setReady(true);
  }, [locale]);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
