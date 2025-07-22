"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  useGetReviewsByUserIdQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from "@/lib/review/reviewApi";
import { fetchReservation } from "@/lib/reservation/reservationThunk";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { Review } from "@/types/reivew";
import { MoreVertical } from "lucide-react";
import LodgeReviewCreateModal from "./LodgeReviewCreateModal";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { formattedDate } from "@/utils/date";
import { useTranslation } from "react-i18next";

const LodgeReview = () => {
  const {t} = useTranslation("lodge-review");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const dispatch = useAppDispatch();
  const nickname = useAppSelector((state) => state.auth.user?.nickname);

  const { data, isLoading, isError } = useGetReviewsByUserIdQuery({
    page,
    pageSize,
  });

  const reviews = data?.reviews || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState("");
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchReservation({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) dispatch(showLoading());
    else dispatch(hideLoading());
  }, [isLoading, dispatch]);

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
      cancelEditing();
    } catch (error) {
      console.error("Failed to update review:", error);
      alert(t("updateFail"));
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await deleteReview(review.id).unwrap();
      alert(t("deleteSuccess"));
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert(t("deleteFail"));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("title", { nickname })}</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-primary-700 text-white rounded mb-4 hover:bg-primary-800 transition-colors"
      >
        {t("createButton")}
      </button>

      {isError && <p className="text-red-500">{t("loadError")}</p>}

      {reviews && reviews.length === 0 && (
        <p className="text-gray-500">{t("empty")}</p>
      )}

      {isModalOpen && (
        <LodgeReviewCreateModal onClose={() => setIsModalOpen(false)} />
      )}

      <ul className="space-y-4">
        {reviews?.map((review: Review) => (
          <li
            key={review.id}
            className="relative border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold">{review.user?.nickname}</span>
                {review.reservation && (
                  <p className="text-md text-primary-900">
                    <span className="text-lg font-semibold mr-3">
                      {review.reservation.lodge.name}
                    </span>
                    ({review.reservation.checkIn.slice(0, 10)} ~{" "}
                    {review.reservation.checkOut.slice(0, 10)})
                  </p>
                )}

                <Rating
                  value={review.rating}
                  readOnly
                  style={{ maxWidth: 100 }}
                />
                <p className="text-sm text-gray-500">
                  {formattedDate(review.createdAt)}
                </p>
                {review.isHidden && (
                  <p className="text-white bg-red-500 px-2 py-1 rounded-sm">
                    {t("hidden")}
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
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(review)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      {t("delete")}
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t("editRatingLabel")}</span>
                  <Rating
                    value={editingRating || 0}
                    onChange={setEditingRating}
                    style={{ maxWidth: 100 }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(review)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    {t("save")}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 border rounded"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-700">{review.comment}</p>
            )}
          </li>
        ))}

        <div className="mt-4 flex gap-2 justify-center items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Prev
          </button>
          <span className="px-2 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </ul>
    </div>
  );
};

export default LodgeReview;
