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

interface Props {
  onClose: () => void;
}

const LodgeReviewCreateModal: React.FC<Props> = ({ onClose }) => {
  const [reservationId, setReservationId] = useState<number | null>(null);

  const [createReview] = useCreateReviewMutation();
  const reservationList = useAppSelector((state) => state.reservation.list);

  const { data: myReviews } = useGetReviewsByUserIdQuery();
  const reviewedReservationIds = new Set(
    (myReviews as Review[])?.map((r) => r.reservationId)
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
    if (!lodgeId) return alert("숙소를 선택해주세요.");

    try {
      await createReview({ lodgeId, comment, rating, reservationId }).unwrap();
      alert("리뷰가 등록되었습니다.");
      onClose();
    } catch (error) {
      console.error("리뷰 생성 실패:", error);
      alert("리뷰 생성에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">숙소 리뷰 작성</h3>

        <label className="block mb-2 font-medium">숙소 선택</label>
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
          <option value="">숙소 선택</option>
          {eligibleLodges?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.lodge.name} - {formatDate(r.checkOut)}
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

export default LodgeReviewCreateModal;
