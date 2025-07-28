"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  useCreateTicketReviewMutation,
  useGetMyTicketReviewsQuery,
} from "@/lib/ticket-review/ticketReviewApi";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { TicketReview } from "@/types/ticketReview";
import { fetchTicketReservations } from "@/lib/ticket-reservation/ticketReservationThunk";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

const TicketReviewCreateModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation("ticket-review-create");
  const [ticketReservationId, setTicketReservationId] = useState<number | null>(
    null
  );

  const dispatch = useAppDispatch();

  const [createReview] = useCreateTicketReviewMutation();
  const tickets = useAppSelector((state) => state.ticketReservation.list);

  const { data: myReviews, refetch } = useGetMyTicketReviewsQuery({
    page: 1,
    pageSize: 100,
  });

  const reviewedReservationIds = new Set<number>(
    (myReviews?.data ?? [])
      .map((r) => r.reservation?.id)
      .filter((id): id is number => typeof id === "number")
  );

  const [ticketTypeId, setTicketTypeId] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchTicketReservations({ page: 1, status: "CONFIRMED" }));
  }, [dispatch]);

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

  const eligibleTickets = tickets?.filter((t) => {
    const ticketDate = getDateOnly(t.date);
    const isBeforeOrToday = ticketDate <= today;
    const isNotReviewed = !reviewedReservationIds.has(t.id);

    return isBeforeOrToday && isNotReviewed;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const handleSubmit = async () => {
    if (!ticketTypeId) return toast.error(t("alert.noTicket"));

    try {
      await createReview({
        ticketTypeId,
        comment,
        rating,
        ticketReservationId,
      }).unwrap();

      await refetch();

      toast.success(t("alert.success"));
      onClose();
    } catch (error) {
      console.error("티켓 리뷰 등록 실패:", error);
      toast.error(t("alert.fail"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{t("title")}</h3>

        <label className="block mb-2 font-medium">{t("selectLabel")}</label>
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
          <option value="">{t("selectPlaceholder")}</option>
          {eligibleTickets?.map((t) => (
            <option key={t.id} value={t.id}>
              {t.ticketType.name} - {formatDate(t.date)}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">{t("ratingLabel")}</label>
        <Rating value={rating} onChange={setRating} style={{ maxWidth: 180 }} />

        <label className="block mb-2 font-medium">{t("commentLabel")}</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
          rows={4}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketReviewCreateModal;
