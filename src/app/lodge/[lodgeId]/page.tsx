"use client";

import ReviewCard from "@/components/ui/ReviewCard";
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
import { useAppSelector } from "@/lib/store/hooks";
import { Bookmark } from "@/types/bookmark";
import { Review } from "@/types/reivew";
import { ArrowLeft, ArrowRight, Heart, HeartOff } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const LodgeDetailPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(0);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [showingLoginModal, setShowingLoginModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string>("");
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [loginModalContext, setLoginModalContext] = useState<
    "reserve" | "bookmark" | null
  >(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") || "Not specified";
  const checkOut = searchParams.get("checkOut") || "Not specified";
  const adults = Number(searchParams.get("adults")) || 1;
  const children = Number(searchParams.get("children")) || 0;
  const roomCount = Number(searchParams.get("roomCount")) || 1;

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeLoginModal();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
    if (!isAuthenticated) {
      setLoginModalContext("reserve");
      setShowingLoginModal(true);
      return;
    }
    const reservationData = {
      lodgeId: Number(lodgeId),
      roomTypeId,
      checkIn,
      checkOut,
      adults,
      children,
      roomCount,
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
      roomCount: String(roomCount),
      lodgeName: lodge?.name || "Unknown Lodge",
      roomName,
    }).toString();

    router.push(`/reservation?${query}`);
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      setLoginModalContext("bookmark");
      setShowingLoginModal(true);
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

  const startEditing = (review: Review) => {
    setEditingId(String(review.id));
    setEditingComment(review.comment || "");
    setEditingRating(review.rating || null);
    setOpenMenuId(null);
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
    const visibleReviews = typesReviews.filter(r => !r.isHidden);
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

  const closeLoginModal = () => {
    setShowingLoginModal(false);
    setLoginModalContext(null);
  };

  if (isLoading) return <div>Loading...</div>;
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
          {lodge.roomTypes?.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold mb-2">{room.name}</h3>
              <p className="text-gray-600 mb-1">
                성인 최대 인원: {room.maxAdults}
              </p>
              <p className="text-gray-600 mb-1">
                어린이 최대 인원: {room.maxChildren}
              </p>
              <p className="text-gray-600 mb-2">
                기본 가격: ₩{room.basePrice.toLocaleString()}
              </p>
              <p className="text-gray-600 mb-2">
                주말 가격: ₩
                {room.weekendPrice !== undefined
                  ? room.weekendPrice.toLocaleString()
                  : room.basePrice.toLocaleString()}
              </p>
              <button
                onClick={() =>
                  room.id !== undefined && handleReserve(room.id, room.name)
                }
                className="mt-4 bg-primary-800 text-white px-4 py-2 rounded hover:bg-primary-500"
              >
                이 객실 예약하기
              </button>
              {room.images?.[0]?.imageUrl && (
                <Image
                  src={room.images[0].imageUrl}
                  alt={room.name}
                  width={400}
                  height={200}
                  className="rounded object-cover w-full h-48 mt-2 hover:cursor-pointer"
                  onClick={() =>
                    openModal(room.images?.map((img) => img.imageUrl) ?? [], 0)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 border-t pt-6">
        <FetchReviews lodgeId={lodgeId} />
      </div>

      {/* ✅ 모달 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 z-10 hover:bg-gray-600"
            >
              <ArrowLeft />
            </button>

            <Image
              src={modalImages[currentModalImage]}
              alt="modal preview"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
              priority
            />

            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 z-10 hover:bg-gray-600"
            >
              <ArrowRight />
            </button>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-3xl font-bold z-20"
            >
              ×
            </button>
          </div>

          {/* 썸네일 */}
          <div className="flex gap-2 mt-6 overflow-x-auto max-w-full px-4">
            {modalImages.map((url, idx) => (
              <div
                key={idx}
                className={`w-24 h-16 relative cursor-pointer ${
                  idx === currentModalImage ? "ring-4 ring-blue-400" : ""
                }`}
                onClick={() => setCurrentModalImage(idx)}
              >
                <Image
                  src={url}
                  alt={`thumbnail-${idx}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {showingLoginModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          ref={modalRef}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full gap-5 flex flex-col items-center">
            <p className="text-primary-900 text-lg font-medium">
              {loginModalContext === "reserve" &&
                "로그인 후 숙소 예약을 완료할 수 있어요."}
              {loginModalContext === "bookmark" &&
                "로그인 후 이 숙소를 찜할 수 있어요."}
            </p>
            <button
              className="bg-primary-700 text-white rounded-md px-3 py-1 hover:bg-primary-500 "
              onClick={() => {
                closeLoginModal();
                router.push("/login");
              }}
            >
              로그인하러 가기
            </button>
          </div>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full gap-5 flex flex-col">
            <h2 className="text-lg font-semibold text-primary-900">
              리뷰 신고하기
            </h2>
            <p className="text-sm text-gray-600">신고 사유를 작성해주세요.</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border rounded p-2 w-full min-h-[100px]"
              placeholder="신고 사유를 입력하세요."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={submitReport}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                신고하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LodgeDetailPage;
