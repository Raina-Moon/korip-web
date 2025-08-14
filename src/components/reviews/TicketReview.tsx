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
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { showConfirm } from "@/utils/showConfirm";
import { getLocalizedField } from "@/utils/getLocalizedField";
import { useLocale } from "@/utils/useLocale";

const TicketReview = () => {
  const { t } = useTranslation("ticket-review");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const nickname = useAppSelector((state) => state.auth.user?.nickname);
  const { data, isError, refetch } = useGetMyTicketReviewsQuery({
    page,
    pageSize,
  });
  const [deleteReview] = useDeleteTicketReviewMutation();
  const [updateReview] = useUpdateTicketReviewMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState("");
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const reviews = (data as any)?.reviews || [];
  const totalCount = (data as any)?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const locale = useLocale();

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
      toast.success(t("updateSuccess"));
      refetch();
    } catch (error) {
      console.error("Failed to update review:", error);
      toast.error(t("updateFail"));
    }
  };

  const handleDelete = (review: TicketReview) => {
    showConfirm({
      message: t("confirmDelete"),
      confirmLabel: t("deleteAlert.yes"),
      cancelLabel: t("deleteAlert.no"),
      onConfirm: async () => {
        try {
          await deleteReview(review.id).unwrap();
          toast.success(t("deleteSuccess"));
          refetch();
        } catch (error) {
          console.error("리뷰 삭제 실패:", error);
          toast.error(t("deleteFail"));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-700">
        {t("title", { nickname })}
      </h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
      >
        {t("createButton")}
      </button>

      {isError && (
        <p className="text-red-600 bg-red-100 p-4 rounded-lg text-center">
          {t("loadError")}
        </p>
      )}

      {reviews && reviews.length === 0 && (
        <p className="text-gray-500 text-center">{t("empty")}</p>
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
            className="relative bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="font-semibold text-gray-900">
                  {review.user?.nickname}
                </span>
                {review.reservation && (
                  <p className="text-md text-primary-900">
                    <span className="text-lg font-semibold mr-3">
                      {getLocalizedField(
                        review.reservation?.ticketType?.name,
                        review.reservation?.ticketType?.nameEn,
                        locale
                      ) || t("unknown")}{" "}
                    </span>
                    <span className="text-gray-600 ml-1 text-sm">
                      -{" "}
                      {getLocalizedField(
                        review.reservation?.ticketType?.lodge?.name,
                        review.reservation?.ticketType?.lodge?.nameEn,
                        locale
                      ) || t("noLodge")}
                    </span>
                    ({review.reservation?.date?.slice(0, 10) || t("unknown")})
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
                  <p className="text-white bg-red-600 px-2 py-1 rounded-sm text-xs inline-block">
                    {t("hidden")}
                  </p>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => toggleMenu(String(review.id))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVertical size={20} />
                </button>
                {openMenuId === String(review.id) && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => startEditing(review)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(review)}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      {t("delete")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editingId === String(review.id) ? (
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  value={editingComment}
                  onChange={(e) => setEditingComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {t("editRatingLabel")}
                  </span>
                  <Rating
                    value={editingRating ?? 0}
                    onChange={setEditingRating}
                    style={{ maxWidth: 100 }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(review)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    {t("save")}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-gray-700">{review.comment}</p>
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketReview;
