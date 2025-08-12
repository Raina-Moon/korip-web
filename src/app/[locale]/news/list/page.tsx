"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import { useGetAllNewsQuery } from "@/lib/news/newsApi";
import { useRouter } from "next/navigation";
import { getLocalizedField } from "@/utils/getLocalizedField";

const formatDate = (dateStr: string, locale: string) => {
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

const NewsListPage = () => {
  const { t } = useTranslation("news-list");
  const locale = useLocale();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useGetAllNewsQuery({ page, limit });

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-primary-800 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight">
        News
      </h1>
      <div className="border-b border-primary-800/20 mt-3 sm:mt-4 mb-6 sm:mb-8" />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 p-4 sm:p-5 animate-pulse"
            >
              <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-red-600 text-sm sm:text-base">Error loading news</p>
      )}

      {!isLoading && !isError && data?.items?.length === 0 && (
        <p className="text-gray-600 text-sm sm:text-base">
          {t("noNewsAvailable")}
        </p>
      )}

      {data?.items && data.items.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {data.items.map((news) => (
            <li key={news.id}>
              <button
                type="button"
                onClick={() => router.push(`/${locale}/news/${news.id}`)}
                className="
                  group w-full text-left
                  rounded-xl border border-gray-200 bg-white
                  p-4 sm:p-5
                  hover:border-primary-300 hover:shadow-md
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                  transition
                "
                aria-label={getLocalizedField(news.title, news.titleEn, locale)}
              >
                <p
                  className="
                    text-primary-900 group-hover:text-primary-700
                    text-base sm:text-lg lg:text-xl font-semibold
                    line-clamp-2
                  "
                >
                  {getLocalizedField(news.title, news.titleEn, locale)}
                </p>

                <p className="mt-2 text-xs sm:text-sm text-gray-600">
                  {formatDate(news.createdAt, locale)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="
              w-full sm:w-auto
              px-4 sm:px-5 py-2.5
              rounded-md
              bg-primary-800 text-white
              disabled:bg-gray-300 disabled:text-gray-600
              hover:bg-primary-700
              transition
            "
            aria-label="Previous page"
          >
            <span className="inline-flex items-center gap-2">
              <i className="bi bi-chevron-left" />
              <span className="text-sm sm:text-base">Prev</span>
            </span>
          </button>

          <span className="text-primary-900 text-sm sm:text-base">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="
              w-full sm:w-auto
              px-4 sm:px-5 py-2.5
              rounded-md
              bg-primary-800 text-white
              disabled:bg-gray-300 disabled:text-gray-600
              hover:bg-primary-700
              transition
            "
            aria-label="Next page"
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-sm sm:text-base">Next</span>
              <i className="bi bi-chevron-right" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsListPage;
