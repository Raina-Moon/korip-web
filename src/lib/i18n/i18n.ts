// src/lib/i18n/i18n.ts
"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: "ko", // 기본 언어
    fallbackLng: false,
    supportedLngs: ["en", "ko"],
    ns: ["page"],
    defaultNS: "page",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
