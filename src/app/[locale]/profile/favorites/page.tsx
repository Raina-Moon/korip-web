"use client";

import {
  useDeleteBookmarkMutation,
  useGetMyBookmarksQuery,
} from "@/lib/bookmark/bookmarkApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import {
  useDeleteTicketBookmarkMutation,
  useGetMyTicketBookmarksQuery,
} from "@/lib/ticket-bookmark/ticketBookmarkApi";
import { Bookmark } from "@/types/bookmark";
import { TicketBookmark } from "@/types/ticketBookmark";
import { getLocalizedLodgeName } from "@/utils/getLocalizedBookmarkField";
import { useLocale } from "@/utils/useLocale";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FavoritesPage = () => {
  const { t, i18n } = useTranslation("favorites");
  const locale = useLocale();
  const [selectedType, setSelectedType] = useState<"LODGING" | "TICKET">(
    "LODGING"
  );

  const { data: bookmarks, isLoading, isError } = useGetMyBookmarksQuery();
  const [deleteBookmark] = useDeleteBookmarkMutation();

  const {
    data: ticketBookmarks,
    isLoading: isTicketLoading,
    isError: isTicketError,
  } = useGetMyTicketBookmarksQuery();

  const [deleteTicketBookmark] = useDeleteTicketBookmarkMutation();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDeleteBookmark = async (lodgeId: number) => {
    try {
      await deleteBookmark(Number(lodgeId)).unwrap();
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  };

  const handleDeleteTicketBookmark = async (ticketId: number) => {
    try {
      await deleteTicketBookmark(Number(ticketId)).unwrap();
    } catch (error) {
      console.error("Failed to delete ticket bookmark:", error);
    }
  };

  useEffect(() => {
    if (isLoading || isTicketLoading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [isLoading, isTicketLoading, dispatch]);

  if (isError) return <div className="px-4 py-6">{t("error")}</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        {t("title")}
      </h1>

      <div
        role="tablist"
        aria-label={t("title")}
        className="mb-6 flex w-full flex-col gap-2 sm:flex-row sm:items-center"
      >
        <div className="inline-flex w-full sm:w-auto rounded-xl border border-primary-700 overflow-hidden">
          <button
            role="tab"
            aria-selected={selectedType === "LODGING"}
            onClick={() => setSelectedType("LODGING")}
            className={`w-1/2 sm:w-auto px-4 py-2 text-sm sm:text-base transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              selectedType === "LODGING"
                ? "bg-primary-700 text-white"
                : "text-primary-800 hover:bg-primary-700/10"
            }`}
          >
            {t("tab.lodging")}
          </button>
          <button
            role="tab"
            aria-selected={selectedType === "TICKET"}
            onClick={() => setSelectedType("TICKET")}
            className={`w-1/2 sm:w-auto px-4 py-2 text-sm sm:text-base transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              selectedType === "TICKET"
                ? "bg-primary-700 text-white"
                : "text-primary-800 hover:bg-primary-700/10"
            }`}
          >
            {t("tab.ticket")}
          </button>
        </div>
      </div>

      {selectedType === "LODGING" && (
        <>
          {isLoading && (
            <p className="text-gray-500 text-sm sm:text-base">{t("loading")}</p>
          )}

          {bookmarks && bookmarks.length === 0 && (
            <p className="text-gray-500 text-sm sm:text-base">{t("empty")}</p>
          )}

          {bookmarks && bookmarks.length > 0 && (
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              aria-live="polite"
            >
              {bookmarks.map((bookmark: Bookmark) => {
                const lodgeName = getLocalizedLodgeName(
                  bookmark.lodge,
                  i18n.language
                );
                return (
                  <li
                    key={bookmark.id}
                    className="group relative rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/${locale}/lodge/${bookmark.lodgeId}`);
                      }}
                      className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
                    >
                      <h2 className="text-base sm:text-lg font-semibold truncate">
                        {lodgeName}
                      </h2>
                      <p className="mt-1 text-gray-600 text-sm line-clamp-2 sm:line-clamp-2">
                        {bookmark.lodge?.address}
                      </p>
                    </button>

                    <div className="absolute top-3 right-3">
                      <button
                        aria-label={t("unfavorite")}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteBookmark(bookmark.lodgeId);
                        }}
                        className="rounded-full p-1.5 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <HeartIcon
                          className="w-6 h-6"
                          fill="red"
                          stroke="red"
                        />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {selectedType === "TICKET" && (
        <>
          {isTicketLoading && (
            <p className="text-gray-500 text-sm sm:text-base">
              {t("loadingTickets")}
            </p>
          )}
          {isTicketError && (
            <p className="text-red-500 text-sm sm:text-base">
              {t("ticketError")}
            </p>
          )}

          {ticketBookmarks && ticketBookmarks.length === 0 && (
            <p className="text-gray-500 text-sm sm:text-base">
              {t("ticketEmpty")}
            </p>
          )}

          {ticketBookmarks && ticketBookmarks.length > 0 && (
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              aria-live="polite"
            >
              {ticketBookmarks.map((bookmark: TicketBookmark) => (
                <li
                  key={bookmark.id}
                  className="group relative rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md"
                >
                  <button
                    onClick={() =>
                      router.push(
                        `/${locale}/ticket/${bookmark.ticketType?.id}`
                      )
                    }
                    className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
                  >
                    <h2 className="text-base sm:text-lg font-semibold truncate">
                      {bookmark.ticketType?.name}
                    </h2>
                    <p className="mt-1 text-gray-600 text-sm line-clamp-2 sm:line-clamp-2">
                      {bookmark.ticketType?.lodge?.address}
                    </p>
                  </button>

                  <div className="absolute top-3 right-3">
                    <button
                      aria-label={t("unfavorite")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTicketBookmark(bookmark.ticketTypeId);
                      }}
                      className="rounded-full p-1.5 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <HeartIcon className="w-6 h-6" fill="red" stroke="red" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
