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
import {
  openLoginModal,
  closeLoginModal,
  setRedirectAfterLogin,
} from "@/lib/auth/authSlice";
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
} from "@/lib/ticket-bookmark/ticketBookmarkApi";
import { LodgeWithTickets, Ticket, TicketBookmark } from "@/types/ticket";
import ImageModal from "@/components/ui/ImageModal";
import { useCreateReportTicketReviewMutation } from "@/lib/report-ticket-review/reportTicketReviewApi";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import toast from "react-hot-toast";
import { showConfirm } from "@/utils/showConfirm";
import KakaoMapModal from "@/components/ui/KakaoMapModal";
import TicketSearchBox from "@/components/ticket/TicketReservationSearckBox";

const TicketDetailPage = () => {
  const { t } = useTranslation("list-lodge");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string>("");
  const [editingRating, setEditingRating] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(0);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const locale = useLocale();

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
  const [sortOption, setSortOption] = useState<
    "latest" | "oldest" | "highest" | "lowest"
  >("latest");

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const myUserId = useAppSelector((state) => state.auth.user?.id);
  const showingLoginModal = useAppSelector(
    (state) => state.auth.showingLoginModal
  );
  const loginModalContext = useAppSelector(
    (state) => state.auth.loginModalContext
  );
  const [createReportTicketReview, { isLoading: isReporting }] =
    useCreateReportTicketReviewMutation();

  const modalRef = useRef<HTMLDivElement>(null);

  const { data: ticket, isLoading } = useGetTicketByIdQuery(ticketId);
  const { data: reviews } = useGetTicketReviewsQuery(ticketId);
  const [createReview] = useCreateTicketReviewMutation();
  const { data: myBookmarks } = useGetMyTicketBookmarksQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: lodgesWithTickets } = useGetAvailableTicketQuery({
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

  // Find the lodge containing the current ticket
  const currentLodge = lodgesWithTickets?.find((lodge) =>
    lodge.ticketTypes.some((t) => t.id === Number(ticketId))
  );
  const lodgeTickets = currentLodge?.ticketTypes || [];

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
      toast.error(t("bookmarkFailed"));
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
      toast.error(t("ratingAlert"));
      return;
    }
    try {
      await updateReview({
        reviewId: review.id,
        data: { comment: editingComment, rating: editingRating },
      }).unwrap();
      setEditingId(null);
      toast.success(t("editSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("editFailed"));
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingComment("");
    setEditingRating(null);
  };

  const handleDelete = (review: GenericReview) => {
    showConfirm({
      message: t("deleteConfirm"),
      confirmLabel: t("delete.yes"),
      cancelLabel: t("delete.no"),
      onConfirm: async () => {
        try {
          await deleteReview(review.id).unwrap();
          toast.success(t("deleteSuccess"));
        } catch (error) {
          console.error(error);
          toast.error(t("deleteFailed"));
        }
      },
    });
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
    router.push(`/${locale}/ticket/${ticketId}?${query}`);
  };

  const handleTicketClick = (ticketId: number) => {
    const query = new URLSearchParams({
      region,
      date,
      adults: String(adults),
      children: String(children),
      sort,
    }).toString();
    router.push(`/${locale}/ticket/${ticketId}?${query}`);
  };

  const handleReserve = (ticket: { id: number; name: string; adultPrice: number; childPrice: number }) => {
    if (!isAuthenticated) {
      localStorage.setItem(
        "pendingReservation",
        JSON.stringify({
          type: "ticket",
          ticketId: ticket.id,
          date,
          adults,
          children,
        })
      );
      dispatch(
        setRedirectAfterLogin(
          `/${locale}/ticket/${ticket.id}?date=${date}&adults=${adults}&children=${children}`
        )
      );
      dispatch(openLoginModal("ticket/reserve"));
      return;
    }
    const query = new URLSearchParams({
      ticketTypeId: String(ticket.id),
      date,
      adults: String(adults),
      children: String(children),
      lodgeName: currentLodge?.name || "",
      ticketTypeName: ticket.name,
      adultPrice: String(ticket.adultPrice),
      childPrice: String(ticket.childPrice),
    }).toString();
    router.push(`/${locale}/ticket-reservation?${query}`);
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

  const handleReportSubmit = async () => {
    if (!selectedReviewId || !reason.trim()) {
      toast.error(t("reportReasonRequired"));
      return;
    }

    try {
      await createReportTicketReview({
        reviewId: selectedReviewId,
        reason: reason.trim(),
      }).unwrap();
      setIsReportModalOpen(false);
      setReason("");
      setSelectedReviewId(null);
      toast.success(t("reportSuccess"));
    } catch (error) {
      console.error("신고 실패:", error);
      toast.error(t("reportFailed"));
    }
  };

  const visibleReviews = (reviews ?? []).filter((r) => !r.isHidden);
  const totalVisible = visibleReviews.length;
  const averageRating = totalVisible
    ? (
        visibleReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        totalVisible
      ).toFixed(1)
    : null;

  const sortedReviews = [...visibleReviews].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortOption === "highest") {
      return (b.rating ?? 0) - (a.rating ?? 0);
    }
    if (sortOption === "lowest") {
      return (a.rating ?? 0) - (b.rating ?? 0);
    }
    return 0;
  });

  if (!ticket || !currentLodge)
    return (
      <div className="p-6 text-gray-600 text-center">
        {t("loadingOrNotFound")}
      </div>
    );

  const imageUrl = ticket?.lodge?.images?.map((img) => img.imageUrl) ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[72rem] mx-auto animate-fade-in">
        <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden shadow-lg mb-6 cursor-pointer z-0 animate-fade-in">
          {imageUrl[0] ? (
            <Image
              src={imageUrl[0]}
              alt={ticket.name}
              width={1152}
              height={320}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              onClick={() => openModal(imageUrl, 0)}
              role="button"
              aria-label={t("viewImages")}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              {t("noImage")}
            </div>
          )}
        </div>

        <div className="relative z-20">
          <TicketSearchBox
            date={date}
            setDate={setDate}
            adults={adults}
            setAdults={setAdults}
            children={children}
            setChildren={setChildren}
            handleSearch={handleSearch}
          />
        </div>

        <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-lg p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h1 className="text-2xl font-bold text-gray-900" aria-label={t("ticketName")}>
                  {ticket.lodge.name}
                </h1>
                <button
                  onClick={handleBookmarkToggle}
                  className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200 ${
                    isBookmarked ? "text-red-500" : "text-gray-400"
                  } hover:text-primary-500`}
                  aria-label={isBookmarked ? t("removeBookmark") : t("addBookmark")}
                  role="button"
                >
                  {isBookmarked ? (
                    <Heart fill="red" stroke="red" className="w-5 h-5" />
                  ) : (
                    <HeartOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div
                className="flex items-center gap-1.5 text-base text-gray-600 cursor-pointer hover:text-primary-500 transition-colors duration-200 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
                onClick={() => setIsMapModalOpen(true)}
                role="button"
                aria-label={t("viewMap")}
              >
                <i className="bi bi-geo-alt text-primary-500"></i>
                {ticket.lodge.address}
              </div>
            </div>

            <div className="grid gap-4">
              {lodgeTickets.map((lodgeTicket) => (
                <div
                  key={lodgeTicket.id}
                  className={`border border-gray-200 rounded-lg p-4 space-y-2 ${
                    lodgeTicket.id === Number(ticketId)
                      ? "bg-primary-50 border-primary-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  } transition-colors duration-200 cursor-pointer`}
                  onClick={() => handleTicketClick(lodgeTicket.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={t("selectTicket", { name: lodgeTicket.name })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleTicketClick(lodgeTicket.id);
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lodgeTicket.name}
                    </h3>
                    {lodgeTicket.id === Number(ticketId) && (
                      <span className="text-sm font-medium text-primary-600">
                        {t("selected")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    {lodgeTicket.description || t("noDescription")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("adultPrice", { price: lodgeTicket.adultPrice.toLocaleString() })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("childPrice", { price: lodgeTicket.childPrice.toLocaleString() })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("availableAdultTickets", { count: lodgeTicket.availableAdultTickets })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("availableChildTickets", { count: lodgeTicket.availableChildTickets })}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from navigating
                      handleReserve(lodgeTicket);
                    }}
                    className="mt-2 h-9 bg-primary-500 text-white px-3 py-1.5 rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200 w-full sm:w-48 text-sm font-medium flex items-center justify-center gap-1.5"
                    aria-label={t("reserveButton")}
                    role="button"
                  >
                    <i className="bi bi-ticket text-xs"></i>
                    {t("reserveButton")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("totalReviews")} ({totalVisible})
              {averageRating && (
                <span className="font-bold text-yellow-600">
                  {" "}
                  ({averageRating} / 5)
                </span>
              )}
            </h2>
            <div className="flex flex-col">
              <label
                htmlFor="sort"
                className="text-xs font-medium text-gray-900 mb-0.5 uppercase tracking-wide"
              >
                {t("sortBy")}
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) =>
                  setSortOption(
                    e.target.value as "latest" | "oldest" | "highest" | "lowest"
                  )
                }
                className="h-9 border border-gray-300 rounded-xl px-2 py-1.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200"
                aria-label={t("sortBy")}
              >
                <option value="latest">{t("latest")}</option>
                <option value="oldest">{t("oldest")}</option>
                <option value="highest">{t("highest")}</option>
                <option value="lowest">{t("lowest")}</option>
              </select>
            </div>
          </div>

          {reviews && reviews.length > 0 ? (
            <div className="grid gap-4">
              {sortedReviews.map((review: TicketReview) => (
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
            <p className="text-lg text-gray-600 text-center">
              {t("noReviews")}
            </p>
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
                onLogin={() => {
                  dispatch(closeLoginModal());
                  router.push(`/${locale}/login`);
                }}
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
          onSubmit={handleReportSubmit}
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

        <KakaoMapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          address={ticket.lodge?.address || ""}
          lat={ticket.lodge?.latitude || 0}
          lng={ticket.lodge?.longitude || 0}
        />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TicketDetailPage;