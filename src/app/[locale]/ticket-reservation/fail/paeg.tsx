"use client";

import { useLocale } from "@/utils/useLocale";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

const TicketFailPage = () => {
  const { t } = useTranslation("ticket-fail");
  const searchParams = useSearchParams();
  const router = useRouter();

  const message = searchParams.get("message") || t("defaultMessage");
  const code = searchParams.get("code");
  const ticketId = searchParams.get("ticketId");

  const locale = useLocale();

  const handleBack = () => {
    if (ticketId) {
      router.push(`/${locale}/ticket/${ticketId}`);
    } else {
      router.push(`/${locale}/`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">{t("title")}</h1>
      <p className="mb-2">{t("reason")}: {message}</p>
      {code && <p className="mb-6 text-gray-500 text-sm">{t("errorCode")}: {code}</p>}

      <button
        onClick={handleBack}
        className="bg-primary-700 text-white px-6 py-2 rounded hover:bg-primary-500"
      >
        {t("back")}
      </button>
    </div>
  );
};

export default TicketFailPage;
