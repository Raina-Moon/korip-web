"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import { useGetEventByIdQuery } from "@/lib/events/eventsApi";
import { useParams, useRouter } from "next/navigation";
import HTMLViewer from "@/components/HTMLViewer";
import { getLocalizedField } from "@/utils/getLocalizedField";

const formatDate = (dateStr?: string, locale?: string) => {
  if (!dateStr || !locale) return "";
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const EventDetailPage = () => {
  const { t } = useTranslation("events-detail");
  const locale = useLocale();
  const router = useRouter();
  const { id } = useParams();

  const { data: event, isLoading, isError } = useGetEventByIdQuery(Number(id));

  const titleToShow = getLocalizedField(event?.title, event?.titleEn, locale);
  const contentToShow = getLocalizedField(
    event?.content,
    event?.contentEn,
    locale
  );

  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-primary-800 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight">
          Events
        </h1>

        <button
          type="button"
          onClick={() => router.push(`/${locale}/events/list`)}
          className="
            inline-flex items-center self-start sm:self-auto
            gap-2 text-primary-700 hover:text-primary-900
            text-sm sm:text-base font-medium
          "
          aria-label={t("backToList")}
        >
          <i className="bi bi-arrow-left" />
          {t("backToList")}
        </button>
      </div>

      <div className="border-b border-primary-800/20 mb-6 sm:mb-8" />

      {isLoading && (
        <div className="rounded-xl border border-gray-200 p-4 sm:p-6 animate-pulse">
          <div className="h-6 sm:h-8 w-3/4 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-1/4 bg-gray-200 rounded mb-5" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-11/12" />
            <div className="h-4 bg-gray-200 rounded w-10/12" />
            <div className="h-4 bg-gray-200 rounded w-9/12" />
          </div>
        </div>
      )}

      {isError && (
        <p className="text-red-600 text-sm sm:text-base">Error loading event</p>
      )}

      {!isLoading && !isError && !event && (
        <p className="text-gray-600 text-sm sm:text-base">
          {t("eventNotFound")}
        </p>
      )}

      {event && (
        <article
          className="
            bg-white rounded-xl border border-gray-200
            p-4 sm:p-6 lg:p-8
            shadow-sm
          "
        >
          <h2
            className="
              text-primary-900 font-semibold
              text-xl sm:text-2xl lg:text-3xl
              leading-snug
              mb-3 sm:mb-4
            "
          >
            {titleToShow}
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            {formatDate(event.createdAt, locale)}
          </p>

          <div
            className="
              prose max-w-none text-gray-800
              prose-p:leading-relaxed
              prose-img:rounded-lg
              prose-headings:scroll-mt-20
              sm:prose-base prose-sm
            "
          >
            <HTMLViewer html={contentToShow} />
          </div>
        </article>
      )}
    </div>
  );
};

export default EventDetailPage;
