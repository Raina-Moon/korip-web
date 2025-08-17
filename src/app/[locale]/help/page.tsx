"use client";

import { useLocale } from "@/utils/useLocale";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const FAQPage = () => {
  const { t } = useTranslation("help");
  const locale = useLocale();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("faq.title")}</h1>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg">{t("faq.q1")}</h2>
          <p className="text-gray-700 mt-2">{t("faq.a1")}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">{t("faq.q2")}</h2>
          <p className="text-gray-700 mt-2">{t("faq.a2")}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">{t("faq.q3")}</h2>
          <p className="text-gray-700 mt-2">
            {t("faq.a3.before")}{" "}
            <Link href={`/${locale}/help/contact`}>
              <span className="text-primary-700 underline">
                {t("contact.title")}
              </span>
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
