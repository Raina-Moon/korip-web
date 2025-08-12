"use client";

import { useLocale } from "@/utils/useLocale";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

const VerifFailedPage = () => {
  const { t } = useTranslation("verif-fail");
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white border border-gray-200 shadow-xl rounded-2xl px-6 sm:px-8 md:px-10 py-8 sm:py-10 text-center">
        <div className="mx-auto mb-4 sm:mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-100/40">
          <AlertCircle
            className="h-7 w-7 sm:h-8 sm:w-8 text-red-600"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-primary-800 font-bold text-2xl sm:text-3xl md:text-4xl leading-tight">
          {t("title")}
        </h1>

        <p className="text-primary-800 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed">
          {t("description")}
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={() => router.push(`/${locale}/signup/email`)}
            className="inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-lg bg-primary-700 text-white text-sm sm:text-base font-semibold shadow-md hover:bg-primary-600 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
          >
            {t("button")}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        div > div {
          animation: fade-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VerifFailedPage;
