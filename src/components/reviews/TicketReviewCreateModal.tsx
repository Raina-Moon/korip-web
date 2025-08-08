"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  useCreateTicketReviewMutation,
  useGetMyTicketReviewsQuery,
} from "@/lib/ticket-review/ticketReviewApi";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { fetchTicketReservations } from "@/lib/ticket-reservation/ticketReservationThunk";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useLocale } from "@/utils/useLocale";
import { getLocalizedField } from "@/utils/getLocalizedField";

interface Props {
  onClose: () => void;
}

const TicketReviewCreateModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation("ticket-review-create");
  const [ticketReservationId, setTicketReservationId] = useState<number | null>(
    null
  );

  const dispatch = useAppDispatch();
  const locale = useLocale();

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h3 className="text-2xl font-semibold text-primary-700">
          {t("title")}
        </h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("selectLabel")}
          </label>
          <select
            value={ticketReservationId ?? ""}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selected = tickets?.find((t) => t.id === selectedId);
              setTicketReservationId(selectedId);
              setTicketTypeId(selected?.ticketType.id ?? null);
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          >
            <option value="">{t("selectPlaceholder")}</option>
            {eligibleTickets?.map((t) => (
              <option key={t.id} value={t.id}>
                {getLocalizedField(
                  t.ticketType.name,
                  t.ticketType.nameEn,
                  locale
                )}{" "}
                - {formatDate(t.date)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("ratingLabel")}
          </label>
          <Rating
            value={rating}
            onChange={setRating}
            style={{ maxWidth: 180 }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("commentLabel")}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          >
            {t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketReviewCreateModal;
