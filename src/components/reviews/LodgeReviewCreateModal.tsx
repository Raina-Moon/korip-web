"use client";

import { useState } from "react";
import {
  useCreateReviewMutation,
  useGetReviewsByUserIdQuery,
} from "@/lib/review/reviewApi";
import { useAppSelector } from "@/lib/store/hooks";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Review } from "@/types/reivew";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

const LodgeReviewCreateModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation("lodge-review-create");
  const [reservationId, setReservationId] = useState<number | null>(null);

  const [createReview] = useCreateReviewMutation();
  const reservationList = useAppSelector((state) => state.reservation.list);

  const { data: myReviews } = useGetReviewsByUserIdQuery({
    page: 1,
    pageSize: 100,
  });

  const reviewedReservationIds = new Set<number>(
    (myReviews?.data ?? [])
      .map((r: Review) => r.reservationId)
      .filter((id): id is number => typeof id === "number")
  );

  const [lodgeId, setLodgeId] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);

  const today = new Date();

  const eligibleLodges = reservationList?.filter((r) => {
    const checkOutDate = new Date(r.checkOut);
    return checkOutDate <= today && !reviewedReservationIds.has(r.id); // 작성된 숙소는 제외
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const handleSubmit = async () => {
    if (!lodgeId) return toast.error(t("alert.noLodge"));

    try {
      await createReview({ lodgeId, comment, rating, reservationId }).unwrap();
      toast.success(t("alert.success"));
      onClose();
    } catch (error) {
      console.error("리뷰 생성 실패:", error);
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
            value={reservationId ?? ""}
            onChange={(e) => {
              const selected = reservationList?.find(
                (r) => r.id === Number(e.target.value)
              );
              setReservationId(selected?.id ?? null);
              setLodgeId(selected?.lodge.id ?? null);
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          >
            <option value="">{t("selectPlaceholder")}</option>
            {eligibleLodges?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.lodge.name} ({formatDate(r.checkIn)} ~ {formatDate(r.checkOut)})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("ratingLabel")}
          </label>
          <Rating value={rating} onChange={setRating} style={{ maxWidth: 180 }} />
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

export default LodgeReviewCreateModal;
