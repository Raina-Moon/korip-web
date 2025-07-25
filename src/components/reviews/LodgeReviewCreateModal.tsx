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
    (myReviews?.reviews ?? []).map((r: Review) => r.reservationId)
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
    if (!lodgeId) return alert(t("alert.noLodge"));

    try {
      await createReview({ lodgeId, comment, rating, reservationId }).unwrap();
      alert(t("alert.success"));
      onClose();
    } catch (error) {
      console.error("리뷰 생성 실패:", error);
      alert(t("alert.fail"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{t("title")}</h3>

        <label className="block mb-2 font-medium">{t("selectLabel")}</label>
        <select
          value={reservationId ?? ""}
          onChange={(e) => {
            const selected = reservationList?.find(
              (r) => r.id === Number(e.target.value)
            );
            setReservationId(selected?.id ?? null);
            setLodgeId(selected?.lodge.id ?? null);
          }}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="">{t("selectPlaceholder")}</option>
          {eligibleLodges?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.lodge.name} ({formatDate(r.checkIn)} ~ {formatDate(r.checkOut)}
              )
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

export default LodgeReviewCreateModal;
