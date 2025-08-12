import { Review } from "@/types/reivew";
import { TicketReview } from "@/types/ticketReview";
import { formattedDate } from "@/utils/date";
import { Rating } from "@smastrom/react-rating";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "@smastrom/react-rating/style.css";
import { useTranslation } from "react-i18next";
import { getLocalizedComment } from "@/utils/getLocalizedComment";

export type GenericReview = Review | TicketReview;

interface ReviewCardProps {
  review: GenericReview;
  myUserId: number | undefined;
  openMenuId: string | null;
  editingId: string | null;
  toggleMenu: (id: string) => void;
  startEditing: (review: GenericReview) => void;
  saveEdit: (review: GenericReview) => void;
  cancelEditing: () => void;
  handleDelete: (review: GenericReview) => void;
  handleReport: (reviewId: number) => void;
  editingComment: string;
  setEditingComment: (comment: string) => void;
  editingRating: number | null;
  setEditingRating: (rating: number | null) => void;
  isLoggedIn: boolean;
}

const ReviewCard = ({
  review,
  myUserId,
  openMenuId,
  editingId,
  toggleMenu,
  startEditing,
  saveEdit,
  cancelEditing,
  handleDelete,
  handleReport,
  editingComment,
  setEditingComment,
  editingRating,
  setEditingRating,
  isLoggedIn,
}: ReviewCardProps) => {
  const { t, i18n } = useTranslation("review");
  const isOwner = myUserId !== undefined && myUserId === review.userId;
  const isEditing = editingId === String(review.id);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (openMenuId === String(review.id)) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          toggleMenu(String(review.id));
        }
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openMenuId, review.id, toggleMenu]);

  function isTicketReview(r: GenericReview): r is TicketReview {
    return (r as TicketReview).ticketReservationId !== undefined;
  }
  function isLodgeReview(r: GenericReview): r is Review {
    return (r as Review).reservationId === undefined;
  }

  const getNightsAndDays = (checkInStr: string, checkOutStr: string) => {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const nights = diffTime / (1000 * 60 * 60 * 24);
    const days = nights + 1;
    return { nights, days };
  };

  return (
    <div className="border rounded-xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition">
      <div className="mb-3 sm:mb-4">
        {isTicketReview(review) && review.reservation && (
          <div className="text-xs sm:text-sm text-gray-500 mb-2 flex flex-wrap gap-x-3 gap-y-1">
            <span>
              <strong>{t("usedOn", { date: review.reservation.date.slice(0, 10) })}</strong>
            </span>
            <span>
              <strong>{t("adults", { count: review.reservation.adults })}</strong>
            </span>
            <span>
              <strong>{t("children", { count: review.reservation.children })}</strong>
            </span>
          </div>
        )}

        {isLodgeReview(review) &&
          review.reservation?.checkIn &&
          review.reservation?.checkOut && (
            <div className="text-xs sm:text-sm text-gray-500 mb-2 flex flex-wrap gap-x-3 gap-y-1">
              <span>
                <strong>{t("checkIn")}:</strong> {review.reservation.checkIn.slice(0, 10)}
              </span>
              <span>
                <strong>{t("checkOut")}:</strong> {review.reservation.checkOut.slice(0, 10)}
              </span>
              <span>
                {(() => {
                  const { nights, days } = getNightsAndDays(
                    review.reservation!.checkIn!,
                    review.reservation!.checkOut!
                  );
                  return <strong>{t("nightDays", { nights, days })}</strong>;
                })()}
              </span>
            </div>
          )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm sm:text-base text-primary-800 font-medium">
            {review.user?.nickname}
          </span>
          <span className="text-xs sm:text-sm text-gray-500">
            {formattedDate(review.createdAt)}
          </span>

          <div className="ml-auto relative">
            {isOwner ? (
              <>
                <button
                  onClick={() => toggleMenu(String(review.id))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  aria-haspopup="menu"
                  aria-expanded={openMenuId === String(review.id)}
                  aria-label={t("edit")}
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {openMenuId === String(review.id) && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 min-w-32 bg-white border rounded-lg shadow-lg z-20 overflow-hidden"
                    role="menu"
                  >
                    <button
                      onClick={() => startEditing(review)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      role="menuitem"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(review)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                      role="menuitem"
                    >
                      {t("delete")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              isLoggedIn &&
              !review.isHidden && (
                <button
                  onClick={() => handleReport(review.id)}
                  className="text-xs sm:text-sm text-red-500 hover:underline px-2 py-1"
                >
                  {t("report")}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {review.isHidden ? (
        <div className="text-gray-400 italic mt-2 text-sm sm:text-base">
          {t("hiddenByAdmin")}
        </div>
      ) : (
        <>
          {!isEditing && (
            <div className="flex items-center gap-2">
              <Rating style={{ maxWidth: 120 }} className="max-w-[88px] sm:max-w-[120px]" value={review.rating} readOnly />
            </div>
          )}

          {isEditing && isOwner ? (
            <div className="mt-3 sm:mt-4 flex flex-col gap-3">
              <textarea
                value={editingComment}
                onChange={(e) => setEditingComment(e.target.value)}
                rows={3}
                className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder={t("editPlaceholder") as string}
              />
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm text-gray-600">{t("yourRating")}</span>
                <Rating
                  value={editingRating ?? 0}
                  onChange={setEditingRating}
                  style={{ maxWidth: 120 }}
                  className="max-w-[100px] sm:max-w-[120px]"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => saveEdit(review)}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm sm:text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {t("save")}
                </button>
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 rounded-md border text-sm sm:text-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 sm:mt-3 text-gray-700 text-sm sm:text-base break-words">
              {getLocalizedComment(review, i18n.language)}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewCard;
