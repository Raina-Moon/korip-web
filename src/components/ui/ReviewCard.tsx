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
  const [closeDropDown, setCloseDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutsideHandler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCloseDropDown(true);
      }
    };
    document.addEventListener("click", clickOutsideHandler);
    return () => {
      document.removeEventListener("click", clickOutsideHandler);
    };
  }, []);

  function isTicketReview(review: GenericReview): review is TicketReview {
    return (review as TicketReview).ticketReservationId !== undefined;
  }

  function isLodgeReview(review: GenericReview): review is Review {
    return (review as Review).reservationId === undefined;
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
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
      <div className="mb-2 relative">
        {isTicketReview(review) && review.reservation && (
          <div className="text-sm text-gray-500 mb-2">
            <span className="mr-2">
              <strong>
                {t("usedOn", { date: review.reservation.date.slice(0, 10) })}
              </strong>
            </span>
            <span className="mr-2">
              <strong>
                {t("adults", { count: review.reservation.adults })}
              </strong>
            </span>
            <span>
              <strong>
                {t("children", { count: review.reservation.children })}
              </strong>
            </span>
          </div>
        )}

        {isLodgeReview(review) &&
          review.reservation?.checkIn &&
          review.reservation?.checkOut && (
            <div className="text-sm text-gray-500 mb-2">
              <span className="mr-2">
                <strong>{t("checkIn")}:</strong>{" "}
                {review.reservation.checkIn.slice(0, 10)}
              </span>
              <span className="mr-2">
                <strong>{t("checkOut")}:</strong>{" "}
                {review.reservation.checkOut.slice(0, 10)}
              </span>
              <span>
                {(() => {
                  const { nights, days } = getNightsAndDays(
                    review.reservation.checkIn,
                    review.reservation.checkOut
                  );
                  return <strong>{t("nightDays", { nights, days })}</strong>;
                })()}
              </span>
            </div>
          )}

        <div className="flex items-center">
          <span className="text-md text-primary-800 font-medium mr-2">
            {review.user?.nickname}
          </span>
          <span className="text-sm text-gray-500">
            {formattedDate(review.createdAt)}
          </span>
        </div>

        {isOwner ? (
          <div className="relative">
            <button
              onClick={() => toggleMenu(String(review.id))}
              className="text-gray-500 hover:text-gray-800 focus:outline-none ml-2"
              aria-label="Options"
            >
              <MoreVertical />
            </button>
            {openMenuId === String(review.id) && (
              <div
                className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10"
                ref={dropdownRef}
                onMouseEnter={() => setCloseDropDown(false)}
                onMouseLeave={() => setCloseDropDown(true)}
              >
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
        ) : (
          isLoggedIn &&
          !review.isHidden && (
            <button
              onClick={() => handleReport(review.id)}
              className="text-sm text-red-500 hover:underline ml-2"
            >
              {t("report")}
            </button>
          )
        )}
      </div>

      {review.isHidden ? (
        <div className="text-gray-400 italic mt-2">{t("hiddenByAdmin")}</div>
      ) : (
        <>
          {!isEditing && (
            <div className="flex items-center gap-2">
              <Rating
                style={{ maxWidth: 100 }}
                value={review.rating}
                readOnly
              />
            </div>
          )}

          {isEditing && isOwner ? (
            <div className="mt-2 flex flex-col gap-2">
              <input
                type="text"
                value={editingComment}
                onChange={(e) => setEditingComment(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <Rating
                value={editingRating ?? 0}
                onChange={setEditingRating}
                style={{ maxWidth: 100 }}
              />
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
            <p className="mt-2 text-gray-700">
              {" "}
              {getLocalizedComment(review, i18n.language)}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewCard;
