"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import {
  useCreateTicketReviewMutation,
  useGetMyTicketReviewsQuery,
} from "@/lib/ticket-review/ticketReviewApi";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { TicketReview } from "@/types/ticketReview";

interface Props {
  onClose: () => void;
}

const TicketReviewCreateModal: React.FC<Props> = ({ onClose }) => {
  const [ticketReservationId, setTicketReservationId] = useState<number | null>(
    null
  );

  const [createReview] = useCreateTicketReviewMutation();
  const tickets = useAppSelector((state) => state.ticketReservation.list);

  const { data: myReviews } = useGetMyTicketReviewsQuery({
    page: 1,
    pageSize: 100,
  });

  const reviewedReservationIds = new Set<number>(
    ((myReviews?.reviews ?? []) as TicketReview[]).map(
      (r) => r.ticketReservation.id
    )
  );

  const [ticketTypeId, setTicketTypeId] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);

  const getDateOnly = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const todayDateOnly = new Date();
  const today = new Date(
    todayDateOnly.getFullYear(),
    todayDateOnly.getMonth(),
    todayDateOnly.getDate()
  );

  console.log("All Tickets:", tickets);
  console.log("Reviewed IDs:", reviewedReservationIds);
  console.log("Today:", today);

  const entireState = useAppSelector((state) => state);
  console.log("Redux state:", entireState);

  const eligibleTickets = tickets?.filter((t) => {
    const ticketDate = getDateOnly(t.date);
    const isBeforeOrToday = ticketDate <= today;
    const isNotReviewed = !reviewedReservationIds.has(t.id);

    console.log(`Ticket ${t.id} - ${formatDate(t.date)}:`, {
      ticketDate,
      isBeforeOrToday,
      isNotReviewed,
    });

    return isBeforeOrToday && isNotReviewed;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const handleSubmit = async () => {
    if (!ticketTypeId) return alert("티켓을 선택해주세요.");

    try {
      await createReview({
        ticketTypeId,
        comment,
        rating,
        ticketReservationId,
      }).unwrap();
      alert("티켓 리뷰가 등록되었습니다.");
      onClose();
    } catch (error) {
      console.error("티켓 리뷰 등록 실패:", error);
      alert("티켓 리뷰 등록 실패");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">티켓 리뷰 작성</h3>

        <label className="block mb-2 font-medium">사용한 티켓</label>
        <select
          value={ticketReservationId ?? ""}
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selected = tickets?.find((t) => t.id === selectedId);
            setTicketReservationId(selectedId);
            setTicketTypeId(selected?.ticketType.id ?? null);
          }}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="">티켓 선택</option>
          {eligibleTickets?.map((t) => (
            <option key={t.id} value={t.id}>
              {t.ticketType.name} - {formatDate(t.date)}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">별점</label>
        <Rating value={rating} onChange={setRating} style={{ maxWidth: 180 }} />

        <label className="block mb-2 font-medium">내용</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
          rows={4}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketReviewCreateModal;
