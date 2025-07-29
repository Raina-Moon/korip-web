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
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FavoritesPage = () => {
  const {t} = useTranslation("favorites");
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

  if (isError) return <div>Error loading bookmarks</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedType("LODGING")}
          className={`px-4 py-2 rounded border ${
            selectedType === "LODGING"
              ? "bg-primary-700 text-white"
              : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
          }`}
        >
          {t("tab.lodging")}
        </button>
        <button
          onClick={() => setSelectedType("TICKET")}
          className={`px-4 py-2 rounded border ${
            selectedType === "TICKET"
              ? "bg-primary-700 text-white"
              : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
          }`}
        >
          {t("tab.ticket")}
        </button>
      </div>

      {selectedType === "LODGING" && (
        <>
          {isLoading && <p className="text-gray-500">{t("loading")}</p>}
          {isError && <p className="text-red-500">{t("error")}</p>}

          {bookmarks && bookmarks.length === 0 && (
            <p className="text-gray-500">{t("empty")}</p>
          )}

          {bookmarks && bookmarks.length > 0 && (
            <ul className="space-y-4">
              {bookmarks.map((bookmark: Bookmark) => (
                <li
                  key={bookmark.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/lodge/${bookmark.lodgeId}`);
                  }}
                  className="cursor-pointer flex justify-between items-center border rounded-lg p-4 shadow-sm bg-white hover:bg-gray-50 transition"
                >
                  <div>
                    <h2 className="text-lg font-bold">
                      {bookmark.lodge?.name}
                    </h2>
                    <p className="text-gray-600">{bookmark.lodge?.address}</p>
                    <p className="text-gray-500 text-sm">
                      {bookmark.lodge?.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteBookmark(bookmark.lodgeId);
                    }}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <HeartIcon fill="red" stroke="red" className="w-6 h-6" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {selectedType === "TICKET" && (
        <>
          {isTicketLoading && (
            <p className="text-gray-500">{t("loadingTickets")}</p>
          )}
          {isTicketError && (
            <p className="text-red-500">{t("ticketError")}</p>
          )}

          {ticketBookmarks && ticketBookmarks.length === 0 && (
            <p className="text-gray-500">{t("ticketEmpty")}</p>
          )}

          {ticketBookmarks && ticketBookmarks.length > 0 && (
            <ul className="space-y-4">
              {ticketBookmarks.map((bookmark: TicketBookmark) => (
                <li
                  key={bookmark.id}
                  onClick={() =>
                    router.push(`/ticket/${bookmark.ticketType?.id}`)
                  }
                  className="cursor-pointer flex justify-between items-center border rounded-lg p-4 shadow-sm bg-white hover:bg-gray-50 transition"
                >
                  <div>
                    <h2 className="text-lg font-bold">
                      {bookmark.ticketType?.name}
                    </h2>
                    <p className="text-gray-600">
                      {bookmark.ticketType?.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) =>{
                      e.stopPropagation();
                      handleDeleteTicketBookmark(bookmark.ticketTypeId)
                    }}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <HeartIcon fill="red" stroke="red" className="w-6 h-6" />
                  </button>
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