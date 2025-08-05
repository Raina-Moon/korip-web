"use client";

import { useLocale } from "@/utils/useLocale";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

const VerifFailedPage = () => {
  const { t } = useTranslation("verif-fail");
  const router = useRouter();
  const locale = useLocale();
  return (
    <div>
      <h1 className="text-3xl font-semibold text-primary-800">{t("title")}</h1>

      <p className="text-primary-800 mt-4">{t("description")}</p>
      <button
        onClick={() => router.push(`/${locale}/signup/email`)}
        className="bg-primary-700 text-white px-4 py-2 rounded-md mt-4 hover:bg-primary-500"
      >
        {t("button")}
      </button>
    </div>
  );
};

export default VerifFailedPage;
