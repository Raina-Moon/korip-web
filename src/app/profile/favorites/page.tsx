"use client"

import { useGetMyBookmarksQuery } from '@/lib/bookmark/bookmarkApi'
import { Bookmark } from '@/types/bookmark';
import React from 'react'

const FavoritesPage = () => {
  const {data:bookmarks, isLoading,isError} = useGetMyBookmarksQuery()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading bookmarks</div>

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
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="text-lg font-bold">{bookmark.lodge?.name}</h2>
              <p className="text-gray-600">{bookmark.lodge?.address}</p>
              <p className="text-gray-500 text-sm">{bookmark.lodge?.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;