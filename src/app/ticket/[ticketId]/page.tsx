"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useGetTicketByIdQuery, useGetTicketReviewsQuery, useCreateTicketReviewMutation } from "@/lib/ticket/ticketApi";
import { useGetMyBookmarksQuery, useCreateBookmarkMutation, useDeleteBookmarkMutation } from "@/lib/bookmark/bookmarkApi";
import { openLoginModal, closeLoginModal } from "@/lib/auth/authSlice";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { Heart, HeartOff } from "lucide-react";
import ReviewCard from "@/components/ui/ReviewCard";
import { TicketReview } from "@/types/ticketReview";
import LoginPromptModal from "@/components/ui/LoginPromptModal";
import ReportModal from "@/components/ui/ReportModal";

const TicketDetailPage = () => {
  const { ticketId } = useParams() as { ticketId: string };
  const dispatch = useAppDispatch();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const myUserId = useAppSelector((state) => state.auth.user?.id);
  const showingLoginModal = useAppSelector((state) => state.auth.showingLoginModal);
  const loginModalContext = useAppSelector((state) => state.auth.loginModalContext);

  const modalRef = useRef<HTMLDivElement>(null);

  const { data: ticket, isLoading } = useGetTicketByIdQuery(ticketId);
  const { data: reviews } = useGetTicketReviewsQuery(ticketId);
  const [createReview] = useCreateTicketReviewMutation();

  const { data: myBookmarks } = useGetMyBookmarksQuery(undefined, { skip: !isAuthenticated });
  const [createBookmark] = useCreateBookmarkMutation();
  const [deleteBookmark] = useDeleteBookmarkMutation();

  const isBookmarked = myBookmarks?.some((b) => b.ticketId === Number(ticketId));

  useEffect(() => {
    if (isLoading) dispatch(showLoading());
    else dispatch(hideLoading());
  }, [isLoading, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showingLoginModal && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        dispatch(closeLoginModal());
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dispatch, showingLoginModal]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal("bookmark"));
      return;
    }
    try {
      if (isBookmarked) {
        await deleteBookmark({ ticketId: Number(ticketId) }).unwrap();
      } else {
        await createBookmark({ ticketId: Number(ticketId) }).unwrap();
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal("review"));
      return;
    }
    if (!reviewComment.trim() || reviewRating < 1) {
      alert("내용과 평점을 입력해주세요.");
      return;
    }
    try {
      await createReview({ id: ticketId, data: { rating: reviewRating, comment: reviewComment.trim() } }).unwrap();
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.error(error);
      alert("리뷰 작성 실패");
    }
  };

  if (!ticket) return <div className="p-6">Loading or not found...</div>;

  const lodgeImage = ticket.lodge?.images?.[0]?.imageUrl;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {lodgeImage ? (
          <div className="relative w-full md:w-1/2 h-72 rounded-lg overflow-hidden">
            <Image
              src={lodgeImage}
              alt={ticket.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full md:w-1/2 h-72 bg-gray-200 flex items-center justify-center rounded-lg">
            No Image
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-primary-900">{ticket.name}</h1>
            <button
              onClick={handleBookmarkToggle}
              className={`text-2xl ${isBookmarked ? "text-red-500" : "text-gray-400"} hover:text-red-600`}
              aria-label={isBookmarked ? "Remove from favorites" : "Add to favorites"}
            >
              {isBookmarked ? <Heart fill="red" stroke="red" /> : <HeartOff />}
            </button>
          </div>
          <p className="text-gray-600 mb-2">{ticket.region}</p>
          <p className="text-gray-800 mb-4">{ticket.description}</p>
          <div className="mb-2">
            <p className="text-primary-900 font-semibold">성인 가격: {ticket.adultPrice.toLocaleString()}원</p>
            <p className="text-primary-900 font-semibold">아동 가격: {ticket.childPrice.toLocaleString()}원</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">리뷰</h2>
        {reviews && reviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {reviews
              .filter((r) => !r.isHidden)
              .map((review: TicketReview) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  myUserId={myUserId}
                  isLoggedIn={isAuthenticated}
                />
              ))}
          </div>
        ) : (
          <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
        )}
        {isAuthenticated && (
          <div className="mt-6 flex flex-col gap-2">
            <h3 className="text-lg font-semibold">리뷰 작성</h3>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="border rounded p-2 w-full min-h-[100px]"
              placeholder="리뷰 내용을 작성해주세요."
            />
            <input
              type="number"
              min={1}
              max={5}
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="border rounded p-2 w-24"
              placeholder="평점 (1~5)"
            />
            <button
              onClick={handleSubmitReview}
              className="bg-primary-700 text-white rounded-md px-4 py-2 hover:bg-primary-500"
            >
              리뷰 등록
            </button>
          </div>
        )}
      </div>

      {showingLoginModal && (
        <div
          onClick={() => dispatch(closeLoginModal())}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div onClick={(e) => e.stopPropagation()} ref={modalRef}>
            <LoginPromptModal
              isOpen={showingLoginModal}
              context={loginModalContext}
              onLogin={() => window.location.href = "/login"}
            />
          </div>
        </div>
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reason={reason}
        setReason={setReason}
        selectedReviewId={selectedReviewId}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default TicketDetailPage;
