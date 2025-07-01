import { Review } from "@/types/reivew";
import { formattedDate } from "@/utils/date";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ReviewCardProps {
  review: Review;
  myUserId: number | undefined;
  openMenuId: string | null;
  editingId: string | null;
  toggleMenu: (id: string) => void;
  startEditing: (review: Review) => void;
  saveEdit: (review: Review) => void;
  cancelEditing: () => void;
  handleDelete: (review: Review) => void;
  handleReport: (reviewId: number) => void;
  editingComment: string;
  setEditingComment: (comment: string) => void;
  editingRating: number | null;
  setEditingRating: (rating: number | null) => void;
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
}: ReviewCardProps) => {
  const isOwner = myUserId === review.userId;
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
          <span className="text-sm text-gray-600 mr-2">
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
          <button
            onClick={() => handleReport(review.id)}
            className="text-sm text-red-500 hover:underline ml-2"
          >
            신고하기
          </button>
        )}
      </div>

      <p>{review.rating} / 5</p>

      {isEditing ? (
        <div className="mt-2 flex flex-col gap-2">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={editingComment}
            onChange={(e) => setEditingComment(e.target.value)}
          />
          <input
            type="number"
            className="border rounded px-3 py-2 w-full"
            value={editingRating ?? ""}
            onChange={(e) => setEditingRating(Number(e.target.value))}
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
    </div>
  );
};

export default ReviewCard;
