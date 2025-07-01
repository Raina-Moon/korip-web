"use client";

import {
  useDeleteBookmarkMutation,
  useGetMyBookmarksQuery,
} from "@/lib/bookmark/bookmarkApi";
import { Bookmark } from "@/types/bookmark";
import { HeartIcon } from "lucide-react";
import React from "react";

const FavoritesPage = () => {
  const { data: bookmarks, isLoading, isError } = useGetMyBookmarksQuery();
  const [deleteBookmark] = useDeleteBookmarkMutation();

  const handleDeleteBookmark = async (lodgeId: number) => {
    try {
      await deleteBookmark({ lodgeId }).unwrap();
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading bookmarks</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Favorite Lodges</h1>

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {isError && <p className="text-red-500">Error loading favorites</p>}

      {bookmarks && bookmarks.length === 0 && (
        <p className="text-gray-500">No favorites found</p>
      )}

      {bookmarks && bookmarks.length > 0 && (
        <ul className="space-y-4">
          {bookmarks.map((bookmark: Bookmark) => (
            <li
              key={bookmark.id}
              className="border rounded-lg p-4 shadow-sm bg-white flex justify-center items-center"
            >
              <div>
                <h2 className="text-lg font-bold">{bookmark.lodge?.name}</h2>
                <p className="text-gray-600">{bookmark.lodge?.address}</p>
                <p className="text-gray-500 text-sm">
                  {bookmark.lodge?.description}
                </p>
              </div>

              <button
                onClick={() => handleDeleteBookmark(bookmark.lodgeId)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                <HeartIcon className="w-6 h-6" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;
