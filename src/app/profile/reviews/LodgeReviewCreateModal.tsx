"use client";

import { useState } from "react";
import { useCreateReviewMutation } from "@/lib/review/reviewApi";
import { useAppSelector } from "@/lib/store/hooks";

interface Props {
  onClose: () => void;
}

const LodgeReviewCreateModal: React.FC<Props> = ({ onClose }) => {
  const [createReview] = useCreateReviewMutation();
  const reservationList = useAppSelector((state) => state.reservation.list);

  const [lodgeId, setLodgeId] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);

  const today = new Date();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const eligibleLodges = reservationList?.filter((r) => {
    const checkOutDate = new Date(r.checkOut);
    return checkOutDate <= today;
  });

  const handleSubmit = async () => {
    if (!lodgeId) return alert("숙소를 선택해주세요.");

    try {
      await createReview({ lodgeId, comment, rating }).unwrap();
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
          value={lodgeId ?? ""}
          onChange={(e) => setLodgeId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="">숙소 선택</option>
          {eligibleLodges?.map((r) => (
            <option key={r.id} value={r.lodge.id}>
              {r.lodge.name} - {formatDate(r.checkOut)}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">별점</label>
        <input
          type="number"
          min={0}
          max={5}
          step={1}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded mb-4"
        />

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
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default LodgeReviewCreateModal;
