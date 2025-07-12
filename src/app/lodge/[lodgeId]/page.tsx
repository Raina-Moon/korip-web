"use client";

import ReviewCard, { GenericReview } from "@/components/ui/ReviewCard";
import { closeLoginModal, openLoginModal } from "@/lib/auth/authSlice";
import {
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
  useGetMyBookmarksQuery,
} from "@/lib/bookmark/bookmarkApi";
import { useGetLodgeByIdQuery } from "@/lib/lodge/lodgeApi";
import { useCreateReportReviewMutation } from "@/lib/report-review/reportReviewApi";
import {
  useDeleteReviewMutation,
  useGetReviewsByLodgeIdQuery,
  useUpdateReviewMutation,
} from "@/lib/review/reviewApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Bookmark } from "@/types/bookmark";
import { Review } from "@/types/reivew";
import { Heart, HeartOff } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ReservationSearchBox from "./ReservationSearchBox";
import RoomCard from "./RoomCard";
import LoginPromptModal from "../../../components/ui/LoginPromptModal";
import ReportModal from "../../../components/ui/ReportModal";
import ImageModal from "../../../components/ui/ImageModal";
import { RoomType } from "@/types/lodge";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";

const LodgeDetailPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(0);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string>("");
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [calendar, setCalendar] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [room, setRoom] = useState(1);
  const [children, setChildren] = useState(0);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  const { lodgeId } = useParams() as { lodgeId: string };

  const router = useRouter();

  const { data: lodge, isLoading, isError } = useGetLodgeByIdQuery(lodgeId);

  const imageUrl = lodge?.images?.map((image) => image.imageUrl) ?? [];

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: myBookmarks } = useGetMyBookmarksQuery(undefined, {
    skip: !isAuthenticated,
  });

  const isBookmarked = myBookmarks?.some(
    (b: Bookmark) => b.lodgeId === Number(lodgeId)
  );

  const myUserId = useAppSelector((state) => state.auth.user?.id);

  const [createBookmark] = useCreateBookmarkMutation();
  const [deleteBookmark] = useDeleteBookmarkMutation();
  const [createReportReview] = useCreateReportReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const showingLoginModal = useAppSelector(
    (state) => state.auth.showingLoginModal
  );
  const loginModalContext = useAppSelector(
    (state) => state.auth.loginModalContext
  );
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
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dispatch, showingLoginModal]);

  const handleAdultChange = (delta: number) => {
    const newAdults = Math.max(1, adults + delta);
    const query = new URLSearchParams(searchParams);
    query.set("adults", String(newAdults));
    router.push(`/lodge/${lodgeId}?${query.toString()}`);
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [isLoading, dispatch]);

  useEffect(() => {
    let checkInStr = searchParams.get("checkIn") ?? "";
    let checkOutStr = searchParams.get("checkOut") ?? "";
    let adultsNum = Number(searchParams.get("adults") ?? "1");
    let roomNum = Number(searchParams.get("roomCount") ?? "1");
    let childrenNum = Number(searchParams.get("children") ?? "0");

    if (!checkInStr || !checkOutStr) {
      try {
        const pending = localStorage.getItem("pendingReservation");
        if (pending) {
          const parsed = JSON.parse(pending);
          checkInStr = parsed.checkIn ?? checkInStr;
          checkOutStr = parsed.checkOut ?? checkOutStr;
          adultsNum = Number(parsed.adults ?? adultsNum);
          roomNum = Number(parsed.room ?? roomNum);
          childrenNum = Number(parsed.children ?? childrenNum);
        }
      } catch (err) {
        console.error("Failed to parse localStorage pendingReservation", err);
      }
    }

    setCheckIn(checkInStr);
    setCheckOut(checkOutStr);
    setAdults(adultsNum);
    setRoom(roomNum);
    setChildren(childrenNum);

    const parseDate = (dateStr: string) => {
      if (!dateStr) return null;
      const [year, month, day] = dateStr.split("-").map(Number);
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      return new Date(year, month - 1, day);
    };

    const parsedCheckIn = parseDate(checkInStr);
    const parsedCheckOut = parseDate(checkOutStr);
    setDateRange(
      parsedCheckIn && parsedCheckOut ? [parsedCheckIn, parsedCheckOut] : null
    );
  }, [searchParams]);

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

  const handleReserve = async (roomTypeId: number, roomName: string) => {
    const reservationData = {
      lodgeId: Number(lodgeId),
      roomTypeId,
      checkIn,
      checkOut,
      adults,
      children,
      roomCount: room,
      lodgeName: lodge?.name || "Unknown Lodge",
      roomName,
    };

    localStorage.setItem("pendingReservation", JSON.stringify(reservationData));

    const query = new URLSearchParams({
      lodgeId: String(lodgeId),
      roomTypeId: String(roomTypeId),
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
      roomCount: String(room),
      lodgeName: lodge?.name || "Unknown Lodge",
      roomName,
    }).toString();

    router.push(`/reservation?${query}`);
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal("lodge/bookmark"));
      return;
    }
    try {
      if (isBookmarked) {
        await deleteBookmark(Number(lodgeId)).unwrap();
      } else {
        await createBookmark({ lodgeId: Number(lodgeId) }).unwrap();
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const startEditing = (review: GenericReview) => {
    setEditingId(String(review.id));
    setEditingComment(review.comment || "");
    setEditingRating(review.rating || null);
    setOpenMenuId(null);
  };

  const saveEdit = async (review: GenericReview) => {
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

  const handleDelete = async (review: GenericReview) => {
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

  const cancelEditing = () => {
    setEditingId(null);
    setEditingComment("");
    setEditingRating(null);
  };

  const handleOpenReportModal = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsReportModalOpen(true);
  };

  const FetchReviews = ({ lodgeId }: { lodgeId: string }) => {
    const [sortOption, setSortOption] = useState<
      "latest" | "oldest" | "highest" | "lowest"
    >("latest");

    const {
      data: reviews,
      isLoading,
      isError,
    } = useGetReviewsByLodgeIdQuery(lodgeId);

    if (isLoading) return <div>Loading reviews...</div>;
    if (isError) return <div>Error loading reviews.</div>;

    if (!reviews || reviews.length === 0) {
      return <div>아직 리뷰가 없습니다.</div>;
    }

    const typesReviews = reviews as Review[];
    const visibleReviews = typesReviews.filter((r) => !r.isHidden);
    const totalReviews = visibleReviews.length;
    const averageRating = (
      visibleReviews.reduce((sum, review) => sum + review.rating, 0) /
      totalReviews
    ).toFixed(1);

    const sortedReviews = [...typesReviews].sort((a, b) => {
      switch (sortOption) {
        case "latest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold text-primary-900">
            총 {totalReviews}개의 리뷰{" "}
            <span className="font-bold">{averageRating}</span> / 5
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              정렬 기준:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) =>
                setSortOption(
                  e.target.value as "latest" | "oldest" | "highest" | "lowest"
                )
              }
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="highest">높은 평점순</option>
              <option value="lowest">낮은 평점순</option>
            </select>
          </div>
        </div>
        {sortedReviews.map((review: Review) => (
          <ReviewCard
            key={review.id}
            review={review}
            myUserId={myUserId}
            openMenuId={openMenuId}
            editingId={editingId}
            toggleMenu={toggleMenu}
            startEditing={startEditing}
            saveEdit={saveEdit}
            cancelEditing={cancelEditing}
            handleDelete={handleDelete}
            editingComment={editingComment}
            setEditingComment={setEditingComment}
            editingRating={editingRating}
            setEditingRating={setEditingRating}
            handleReport={handleOpenReportModal}
            isLoggedIn={isAuthenticated}
          />
        ))}
      </div>
    );
  };

  const submitReport = async () => {
    if (!selectedReviewId || !reason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }

    try {
      await createReportReview({
        reviewId: selectedReviewId,
        reason: reason.trim(),
      }).unwrap();

      alert("리뷰가 신고되었습니다.");
      setIsReportModalOpen(false);
      setReason("");
      setSelectedReviewId(null);
    } catch (error) {
      console.error("Failed to report review:", error);
      alert("리뷰 신고에 실패했습니다.");
    }
  };

  const handleRoomChange = (delta: number) => {
    const newRoom = Math.max(1, room + delta);
    const query = new URLSearchParams(searchParams);
    query.set("roomCount", String(newRoom));
    router.push(`/lodge/${lodgeId}?${query.toString()}`);
  };

  const handleChildrenChange = (delta: number) => {
    const newChildren = Math.max(0, children + delta);
    const query = new URLSearchParams(searchParams);
    query.set("children", String(newChildren));
    router.push(`/lodge/${lodgeId}?${query.toString()}`);
  };

  const handleSearch = () => {
    const query = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
      roomCount: String(room),
    }).toString();

    router.push(`/lodge/${lodgeId}?${query}`);
  };

  if (isError) return <div>Error loading lodge details.</div>;
  if (!lodge) return <div>No lodge data found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="w-full h-80 rounded-xl overflow-hidden mb-6 cursor-pointer">
        {imageUrl[0] ? (
          <Image
            src={imageUrl[0]}
            alt={lodge.name}
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

      <ReservationSearchBox
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        dateRange={dateRange}
        setDateRange={setDateRange}
        calendar={calendar}
        setCalendar={setCalendar}
        isActive={isActive}
        setIsActive={setIsActive}
        adults={adults}
        setAdults={setAdults}
        room={room}
        setRoom={setRoom}
        children={children}
        setChildren={setChildren}
        handleAdultChange={handleAdultChange}
        handleRoomChange={handleRoomChange}
        handleChildrenChange={handleChildrenChange}
        handleSearch={handleSearch}
      />

      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-3xl font-bold text-primary-900">{lodge.name}</h1>
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
      <p className="text-gray-600 mb-4">{lodge.address}</p>

      {/* 설명 */}
      {lodge.description && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">숙소 설명</h2>
          <p className="text-gray-700">{lodge.description}</p>
        </div>
      )}

      {/* 객실 목록 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">객실 정보</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {lodge.roomTypes
            ?.filter((room) => room.id !== undefined)
            .map((room) => (
              <RoomCard
                key={room.id}
                room={room as RoomType & { id: number }}
                isAuthenticated={isAuthenticated}
                handleReserve={handleReserve}
                openModal={openModal}
                checkIn={checkIn}
                checkOut={checkOut}
              />
            ))}
        </div>
      </div>

      <div className="mt-12 border-t pt-6">
        <FetchReviews lodgeId={lodgeId} />
      </div>

      {/* ✅ 모달 */}
      <ImageModal
        isOpen={isOpen}
        images={modalImages}
        currentIndex={currentModalImage}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        onClose={closeModal}
        setCurrentIndex={setCurrentModalImage}
      />

      {showingLoginModal && (
        <div
          onClick={() => dispatch(closeLoginModal())}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LoginPromptModal
              isOpen={showingLoginModal}
              context={loginModalContext}
              onLogin={() => router.push("/login")}
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
        onSubmit={submitReport}
      />
    </div>
  );
};

export default LodgeDetailPage;
