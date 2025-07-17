"use client";

import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  useGetTicketByIdQuery,
  useGetTicketReviewsQuery,
  useCreateTicketReviewMutation,
  useUpdateTicketReviewMutation,
  useDeleteTicketReviewMutation,
  useGetAvailableTicketQuery,
} from "@/lib/ticket/ticketApi";
import { openLoginModal, closeLoginModal } from "@/lib/auth/authSlice";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { Heart, HeartOff } from "lucide-react";
import ReviewCard, { GenericReview } from "@/components/ui/ReviewCard";
import { TicketReview } from "@/types/ticketReview";
import LoginPromptModal from "@/components/ui/LoginPromptModal";
import ReportModal from "@/components/ui/ReportModal";
import {
  useCreateTicketBookmarkMutation,
  useDeleteTicketBookmarkMutation,
  useGetMyTicketBookmarksQuery,
} from "@/lib/ticket-bookmark/ticketBookmark";
import { TicketBookmark } from "@/types/ticket";
import TicketSearchBox from "./TicketReservationSearckBox";
import ImageModal from "@/components/ui/ImageModal";

const TicketDetailPage = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string>("");
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(0);
  const [modalImages, setModalImages] = useState<string[]>([]);

  const searchParams = useSearchParams();

  const regionParam = searchParams.get("region") || "전체";
  const dateParam = searchParams.get("date") || "";
  const adultsParam = Number(searchParams.get("adults") || "1");
  const childrenParam = Number(searchParams.get("children") || "0");
  const sort = searchParams.get("sort") || "popularity";

  const [region, setRegion] = useState(regionParam);
  const [date, setDate] = useState(dateParam);
  const [adults, setAdults] = useState(adultsParam);
  const [children, setChildren] = useState(childrenParam);

  const { ticketId } = useParams() as { ticketId: string };

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const myUserId = useAppSelector((state) => state.auth.user?.id);
  const showingLoginModal = useAppSelector(
    (state) => state.auth.showingLoginModal
  );
  const loginModalContext = useAppSelector(
    (state) => state.auth.loginModalContext
  );

  const modalRef = useRef<HTMLDivElement>(null);

  const { data: ticket, isLoading } = useGetTicketByIdQuery(ticketId);
  const { data: reviews } = useGetTicketReviewsQuery(ticketId);
  const [createReview] = useCreateTicketReviewMutation();

  const { data: myBookmarks } = useGetMyTicketBookmarksQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: tickets } = useGetAvailableTicketQuery({
    region,
    date,
    adults,
    children,
    sort,
  });

  const [createBookmark] = useCreateTicketBookmarkMutation();
  const [deleteBookmark] = useDeleteTicketBookmarkMutation();

  const [updateReview] = useUpdateTicketReviewMutation();
  const [deleteReview] = useDeleteTicketReviewMutation();

  const isBookmarked = (myBookmarks as TicketBookmark[] | undefined)?.some(
    (b) => b.ticketTypeId === Number(ticketId)
  );

  useEffect(() => {
    if (isLoading) dispatch(showLoading());
    else dispatch(hideLoading());
  }, [isLoading, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showingLoginModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        dispatch(closeLoginModal());
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dispatch, showingLoginModal]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal("ticket/bookmark"));
      return;
    }
    try {
      if (isBookmarked) {
        await deleteBookmark(Number(ticketId)).unwrap();
      } else {
        await createBookmark({ ticketId: Number(ticketId) }).unwrap();
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim() || reviewRating < 1) {
      alert("내용과 평점을 입력해주세요.");
      return;
    }
    try {
      await createReview({
        id: ticketId,
        data: { rating: reviewRating, comment: reviewComment.trim() },
      }).unwrap();
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.error(error);
      alert("리뷰 작성 실패");
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const startEditing = (review: GenericReview) => {
    setEditingId(String(review.id));
    setEditingComment(review.comment ?? "");
    setEditingRating(review.rating ?? null);
    setOpenMenuId(null);
  };

  const saveEdit = async (review: GenericReview) => {
    if (!editingRating || editingRating < 1) {
      alert("평점을 입력해주세요");
      return;
    }
    try {
      await updateReview({
        reviewId: review.id,
        data: { comment: editingComment, rating: editingRating },
      }).unwrap();
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("리뷰 수정 실패");
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingComment("");
    setEditingRating(null);
  };

  const handleDelete = async (review: GenericReview) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteReview(review.id).unwrap();
        alert("삭제 완료");
      } catch (error) {
        console.error(error);
        alert("리뷰 삭제 실패");
      }
    }
  };

  const handleReport = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsReportModalOpen(true);
  };

  const handleSearch = () => {
    const query = new URLSearchParams({
      region,
      date,
      adults: String(adults),
      children: String(children),
      sort,
    }).toString();
    router.push(`/ticket/${ticketId}?${query}`);
  };

  const openModal = (images: string[], index: number) => {
    setModalImages(images);
    setCurrentModalImage(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalImages([]);
    setCurrentModalImage(0);
  };

  const handlePrevImage = () => {
    setCurrentModalImage((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentModalImage((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  };

  if (!ticket) return <div className="p-6">Loading or not found...</div>;

  const imageUrl = ticket?.lodge?.images?.map((img) => img.imageUrl) ?? [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="w-full h-80 rounded-xl overflow-hidden mb-6 cursor-pointer">
        {imageUrl[0] ? (
          <Image
            src={imageUrl[0]}
            alt={ticket.name}
            width={1200}
            height={400}
            className="object-cover w-full h-full"
            onClick={() => openModal(imageUrl, 0)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No image available
          </div>
        )}
      </div>

      <TicketSearchBox
        date={date}
        setDate={setDate}
        adults={adults}
        setAdults={setAdults}
        children={children}
        setChildren={setChildren}
        handleSearch={handleSearch}
      />

      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-3xl font-bold text-primary-900">{ticket.name}</h1>
        <button
          onClick={handleBookmarkToggle}
          className={`text-2xl ${
            isBookmarked ? "text-red-500" : "text-gray-400"
          } hover:text-red-600`}
          aria-label={
            isBookmarked ? "Remove from favorites" : "Add to favorites"
          }
        >
          {isBookmarked ? (
            <Heart fill="red" stroke="red" className="w-6 h-6" />
          ) : (
            <HeartOff className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded">
        <h3 className="text-lg font-semibold text-primary-900 mb-2">
          이용 요금
        </h3>
        <p className="text-primary-800">
          <span className="font-medium">성인:</span>{" "}
          {ticket.adultPrice
            ? `${ticket.adultPrice.toLocaleString()}원`
            : "정보 없음"}
        </p>
        <p className="text-primary-800">
          <span className="font-medium">아동:</span>{" "}
          {ticket.childPrice
            ? `${ticket.childPrice.toLocaleString()}원`
            : "정보 없음"}
        </p>
      </div>

      <button
        onClick={() => {
          if (!isAuthenticated) {
            dispatch(openLoginModal("ticket/reserve"));
            return;
          }

          const query = new URLSearchParams({
            ticketTypeId: String(ticket.id),
            date,
            adults: String(adults),
            children: String(children),
            lodgeName: ticket.lodge.name,
            ticketTypeName: ticket.name,
            adultPrice: String(ticket.adultPrice),
            childPrice: String(ticket.childPrice),
          }).toString();

          router.push(`/ticket-reservation?${query}`);
        }}
        className="mt-8 bg-primary-700 text-white px-6 py-3 rounded hover:bg-primary-500"
      >
        예약하기
      </button>

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
                  openMenuId={openMenuId}
                  editingId={editingId}
                  toggleMenu={toggleMenu}
                  startEditing={startEditing}
                  saveEdit={saveEdit}
                  cancelEditing={cancelEditing}
                  handleDelete={handleDelete}
                  handleReport={handleReport}
                  editingComment={editingComment}
                  setEditingComment={setEditingComment}
                  editingRating={editingRating}
                  setEditingRating={setEditingRating}
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
              onLogin={() => (window.location.href = "/login")}
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

      <ImageModal
        isOpen={isOpen}
        images={modalImages}
        currentIndex={currentModalImage}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        onClose={closeModal}
        setCurrentIndex={setCurrentModalImage}
      />
    </div>
  );
};

export default TicketDetailPage;
