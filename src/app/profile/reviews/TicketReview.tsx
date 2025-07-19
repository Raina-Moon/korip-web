"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import {
  useGetMyTicketReviewsQuery,
  useDeleteTicketReviewMutation,
  useUpdateTicketReviewMutation,
} from "@/lib/ticket-review/ticketReviewApi";
import { MoreVertical } from "lucide-react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { formattedDate } from "@/utils/date";
import type { TicketReview } from "@/types/ticketReview";
import TicketReviewCreateModal from "./TicketReviewCreateModal";

const TicketReview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const nickname = useAppSelector((state) => state.auth.user?.nickname);
  const { data, isLoading, isError, refetch } = useGetMyTicketReviewsQuery({
    page,
    pageSize,
  });
  const [deleteReview] = useDeleteTicketReviewMutation();
  const [updateReview] = useUpdateTicketReviewMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState("");
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const reviews = data?.reviews || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const toggleMenu = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const startEditing = (review: TicketReview) => {
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

  const saveEdit = async (review: TicketReview) => {
    try {
      await updateReview({
        reviewId: review.id,
        data: {
          comment: editingComment,
          rating: editingRating ?? 0,
        },
      }).unwrap();
      cancelEditing();
      alert("리뷰가 업데이트되었습니다");
      refetch();
    } catch (error) {
      console.error("Failed to update review:", error);
      alert("Failed to update review");
    }
  };

  const handleDelete = async (review: TicketReview) => {
    if (!confirm("리뷰를 삭제할까요?")) return;
    try {
      await deleteReview(review.id).unwrap();
      alert("리뷰가 삭제되었습니다");
      refetch();
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제 실패");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{nickname}의 티켓 리뷰</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-primary-700 text-white rounded mb-4 hover:bg-primary-800 transition-colors"
      >
        티켓 리뷰 작성
      </button>
      {isError && <p className="text-red-500">리뷰를 불러오는 중 오류 발생</p>}
      {reviews && reviews.length === 0 && (
        <p className="text-gray-500">작성된 티켓 리뷰가 없습니다</p>
      )}

      {isModalOpen && (
        <TicketReviewCreateModal
          onClose={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      )}

      <ul className="space-y-4">
        {reviews?.map((review: TicketReview) => (
          <li
            key={review.id}
            className="relative border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold">{review.user?.nickname}</span>
                {review.ticketReservation && (
                  <p className="text-md text-primary-900">
                    <span className="text-lg font-semibold mr-3">
                      {review.ticketReservation.ticketType.name}
                    </span>
                    ({review.ticketReservation.date.slice(0, 10)})
                  </p>
                )}
                <Rating
                  value={review.rating}
                  readOnly
                  style={{ maxWidth: 100 }}
                />{" "}
                <p className="text-sm text-gray-500">
                  {formattedDate(review.createdAt)}
                </p>
                {review.isHidden && (
                  <p className="text-white bg-red-500 px-2 py-1 rounded-sm">
                    가려진 리뷰입니다.
                  </p>
                )}
              </div>
              <div className="relative">
                <button onClick={() => toggleMenu(String(review.id))}>
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
                  value={editingComment}
                  onChange={(e) => setEditingComment(e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(review)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 border rounded"
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

        {totalPages > 1 && (
          <div className="mt-4 flex gap-2 justify-center items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </ul>
    </div>
  );
};

export default TicketReview;
