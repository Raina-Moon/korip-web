import { Review } from "@/types/reivew";
import { TicketReview } from "@/types/ticketReview";
import { formattedDate } from "@/utils/date";
import { Rating } from "@smastrom/react-rating";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "@smastrom/react-rating/style.css";

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

  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2 relative">
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
        ) : (
          isLoggedIn &&
          !review.isHidden && (
            <button
              onClick={() => handleReport(review.id)}
              className="text-sm text-red-500 hover:underline ml-2"
            >
              신고하기
            </button>
          )
        )}
      </div>

      {review.isHidden ? (
        <div className="text-gray-400 italic mt-2">
          관리자에 의해 가려진 댓글입니다.
        </div>
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
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-gray-700">{review.comment}</p>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewCard;
