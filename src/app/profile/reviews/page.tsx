"use client";

import {
  useDeleteReviewMutation,
  useGetReviewsByUserIdQuery,
  useUpdateReviewMutation,
} from "@/lib/review/reviewApi";
import { useAppSelector } from "@/lib/store/hooks";
import { Review } from "@/types/reivew";
import { MoreVertical } from "lucide-react";
import React, { useState } from "react";

const ReviewsPage = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string>("");
  const [editingRating, setEditingRating] = useState<number | null>(null);

  const { data: reviews, isLoading, isError } = useGetReviewsByUserIdQuery();
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const nickname = useAppSelector((state) => state.auth.user?.nickname);

  const toggleMenu = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const startEditing = (review: Review) => {
    setEditingId(String(review.id));
    setEditingComment(review.comment || "");
    setEditingRating(review.rating || null);
    setOpenMenuId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingComment("");
    setEditingRating(null);
  };

  const saveEdit = async (review: Review) => {
    try {
      await updateReview({
        id: review.id,
        comment: editingComment,
        rating: editingRating,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update review:", error);
      alert("Failed to update review");
    }
  };

  const handleDelete = async (review: Review) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(review.id).unwrap();
        alert("Review deleted successfully");
      } catch (error) {
        console.error("Failed to delete review:", error);
        alert("Failed to delete review");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{nickname}'s Reviews</h1>

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {isError && <p className="text-red-500">Error loading reviews</p>}
      {reviews && reviews.length === 0 && (
        <p className="text-gray-500">No reviews found</p>
      )}

      {reviews && reviews.length > 0 && (
        <ul className="space-y-4">
          {reviews.map((review: Review) => (
            <li
              key={review.id}
              className="relative border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{review.user?.nickname}</span>
                  <p className="text-yellow-500">{review.rating} / 5</p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => toggleMenu(String(review.id))}
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                    aria-label="Options"
                  >
                    <MoreVertical />
                  </button>
                  {openMenuId === String(review.id) && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                      <button
                        onClick={() => startEditing(review)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {editingId === String(review.id) ? (
                <div className="mt-2 flex flex-col gap-2">
                  <input
                    type="text"
                    className="border rounded px-3 py-2 w-full"
                    value={editingComment}
                    onChange={(e) => setEditingComment(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(review)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-gray-700">{review.comment}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsPage;
