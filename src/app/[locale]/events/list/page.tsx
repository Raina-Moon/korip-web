"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import { useGetAllEventsQuery } from "@/lib/events/eventsApi";
import { useRouter } from "next/navigation";
import { getLocalizedField } from "@/utils/getLocalizedField";

const EventsListPage = () => {
  const { t } = useTranslation("events-list");
  const locale = useLocale();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useGetAllEventsQuery({ page, limit });

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-5 py-10">
      <h1 className="text-primary-800 font-bold text-3xl mb-6">Events</h1>
      <div className="border-b border-primary-800 mb-6"></div>

      {isLoading && <p className="text-gray-600">Loading...</p>}
      {isError && <p className="text-red-600">Error loading events</p>}
      {!isLoading && !isError && data?.items?.length === 0 && (
        <p className="text-gray-600">{t("noEventsAvailable")}</p>
      )}

      {data?.items && data.items.length > 0 && (
        <ul className="space-y-4">
          {data.items.map((event) => (
            <li
              key={event.id}
              className="border-b border-gray-200 pb-4 last:border-b-0 cursor-pointer"
            >
              <div
                onClick={() => router.push(`/${locale}/events/${event.id}`)}
                className="text-primary-900 hover:text-primary-600 transition-colors duration-200"
              >
                <p className="text-lg font-medium">
                  {getLocalizedField(event.title, event.titleEn, locale)}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(event.createdAt).toLocaleDateString(locale)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-primary-800 text-white rounded-md disabled:bg-gray-400 hover:bg-primary-600 transition-colors duration-200"
          >
            <i className="bi bi-chevron-left mr-2"></i>
            Prev
          </button>
          <span className="text-primary-900">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-primary-800 text-white rounded-md disabled:bg-gray-400 hover:bg-primary-600 transition-colors duration-200"
          >
            Next
            <i className="bi bi-chevron-right ml-2"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsListPage;
