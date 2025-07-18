"use client";

import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByUserIdQuery,
  useUpdateReviewMutation,
} from "@/lib/review/reviewApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Review } from "@/types/reivew";
import { MoreVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { fetchReservation } from "@/lib/reservation/reservationThunk";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useGetMyTicketReviewsQuery } from "@/lib/ticket-review/ticketReviewApi";
import {
  useDeleteTicketReviewMutation,
  useUpdateTicketReviewMutation,
} from "@/lib/ticket/ticketApi";

const ReviewsPage = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string>("");
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [selectedReservationId, setSelectedReservationId] =
    useState<string>("");
  const [selectedType, setSelectedType] = useState<"lodge" | "ticket">("lodge");

  const [createReview] = useCreateReviewMutation();

  const {
    data: lodgeReviews,
    isLoading: isLodgeLoading,
    isError: isLodgeError,
  } = useGetReviewsByUserIdQuery();

  const {
    data: ticketReviews,
    isLoading: isTicketLoading,
    isError: isTicketError,
  } = useGetMyTicketReviewsQuery();

  const [deleteLodgeReview] = useDeleteReviewMutation();
  const [deleteTicketReview] = useDeleteTicketReviewMutation();

  const [updateLodgeReview] = useUpdateReviewMutation();
  const [updateTicketReview] = useUpdateTicketReviewMutation();

  const nickname = useAppSelector((state) => state.auth.user?.nickname);
  const reservation = useAppSelector((state) => state.reservation.list);

  const selectedReviews =
    selectedType === "lodge" ? lodgeReviews : ticketReviews;
  const selectedIsError =
    selectedType === "lodge" ? isLodgeError : isTicketError;
  const selectedIsLoading =
    selectedType === "lodge" ? isLodgeLoading : isTicketLoading;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReservation());
  }, [dispatch]);

  useEffect(() => {
    if (selectedIsLoading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [selectedIsLoading, dispatch]);

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
      if (selectedType === "lodge") {
        await updateLodgeReview({
          id: review.id,
          comment: editingComment,
          rating: editingRating,
        }).unwrap();
      } else {
        await updateTicketReview({
          id: review.id,
          comment: editingComment,
          rating: editingRating,
        }).unwrap();
      }
      cancelEditing();
    } catch (error) {
      console.error("Failed to update review:", error);
      alert("Failed to update review");
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      if (selectedType === "lodge") {
        await deleteLodgeReview(review.id).unwrap();
      } else {
        await deleteTicketReview(review.id).unwrap();
      }
      alert("Review deleted successfully");
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to delete review");
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastReservations = reservation.filter(
    (res) => new Date(res.checkOut) < today
  );

  const handleSubmitReview = async () => {
    try {
      await createReview({
        comment: newComment,
        rating: newRating,
        reservationId: Number(selectedReservationId),
      }).unwrap();
      alert("Review created successfully");
      setShowCreateModal(false);
      setNewComment("");
      setNewRating(0);
      setSelectedReservationId("");
    } catch (error) {
      console.error("Failed to create review:", error);
      alert("Failed to create review");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{nickname}'s Reviews</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedType("lodge")}
          className={`px-4 py-2 rounded ${
            selectedType === "lodge"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          숙소 리뷰
        </button>
        <button
          onClick={() => setSelectedType("ticket")}
          className={`px-4 py-2 rounded ${
            selectedType === "ticket"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          티켓 리뷰
        </button>
      </div>

      {selectedIsError && <p className="text-red-500">Error loading reviews</p>}

      {selectedReviews && selectedReviews.length === 0 && (
        <p className="text-gray-500">No reviews found</p>
      )}

      {pastReservations.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <span>체크아웃된 숙소에 리뷰를 작성해 주세요!</span>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
          >
            리뷰 작성하기
          </button>
        </div>
      )}

      {selectedReviews && selectedReviews.length > 0 && (
        <ul className="space-y-4">
          {selectedReviews.map((review: Review) => (
            <li
              key={review.id}
              className="relative border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{review.user?.nickname}</span>
                  <p className="text-yellow-500">{review.rating} / 5</p>
                  {review.isHidden && (
                    <p className="text-white bg-red-500 px-2 py-1 rounded-sm">
                      가려진 리뷰입니다.
                    </p>
                  )}
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">리뷰 작성하기</h2>

            <label className="block mb-2 text-sm font-medium">숙소 선택</label>
            <select
              value={selectedReservationId}
              onChange={(e) => setSelectedReservationId(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-4"
            >
              <option value="">숙소를 선택하세요</option>
              {pastReservations.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.lodge?.name} ({res.checkOut.slice(0, 10)} 체크아웃)
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium">코멘트</label>
            <textarea
              className="border rounded px-3 py-2 w-full mb-4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <label className="block mb-2 text-sm font-medium">별점</label>
            <Rating
              value={newRating}
              onChange={setNewRating}
              items={5}
              halfFillMode="svg"
              style={{ maxWidth: 200 }}
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSubmitReview}
                className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
              >
                저장
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="border rounded px-4 py-2 hover:bg-gray-100"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
