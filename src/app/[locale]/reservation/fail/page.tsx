"use client";
export const runtime = 'edge';

import { useLocale } from "@/utils/useLocale";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

const FailPage = () => {
  const {t} = useTranslation("payment-fail");
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = useLocale();

  const message = searchParams.get("message") || t("fail.defaultMessage");
  const code = searchParams.get("code");
  const lodgeId = searchParams.get("lodgeId");

  const handleBack = () => {
    if (lodgeId) {
      router.push(`/${locale}/lodge/${lodgeId}`);
    } else {
      router.push(`/${locale}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">{t("fail.title")}</h1>
      <p className="mb-2">{t("fail.reason", { message })}</p>
      {code && <p className="mb-6 text-gray-500 text-sm">{t("fail.code", { code })}</p>}

      <button
        onClick={handleBack}
        className="bg-primary-700 text-white px-6 py-2 rounded hover:bg-primary-500"
      >
        {t("fail.back")}
      </button>
    </div>
  );
};

export default FailPage;
