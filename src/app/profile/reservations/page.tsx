"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchReservation } from "@/lib/reservation/reservationThunk";
import Link from "next/link";

export default function ReservationListPage() {
  const [showingModal, setShowingModal] = useState(false);
  const [pending, setPending] = useState<any | null>(null);

  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.reservation);

  useEffect(() => {
    dispatch(fetchReservation());
  }, [dispatch]);

  const openModal = (reservation: any) => {
    setShowingModal(true);
    setPending(reservation);
    console.log("예약 정보:", reservation);
  };

  const parsedSpecialRequests = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">내 예약 목록</h1>

      {loading && <p className="text-gray-600">불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && list.length === 0 && (
        <p className="text-gray-700">예약 내역이 없습니다.</p>
      )}

      <div className="space-y-4">
        {list.map((reservation) => (
          <div
            key={reservation.id}
            className="border rounded p-4 shadow hover:shadow-lg transition"
            onClick={() => openModal(reservation)}
          >
            <h2 className="text-lg font-semibold mb-2">
              {reservation.lodge?.name || "이름 없는 숙소"}
            </h2>

            <p className="text-sm text-gray-700 mb-1">
              방 타입: {reservation.roomType?.name || "정보 없음"}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              체크인: {reservation.checkIn.slice(0, 10)}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              체크아웃: {reservation.checkOut.slice(0, 10)}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              성인 {reservation.adults}명, 어린이 {reservation.children}명
            </p>
            <p className="text-sm text-gray-700 mb-1">
              객실 수: {reservation.roomCount}
            </p>
            <p className="text-sm text-gray-500">
              예약일: {new Date(reservation.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-block border border-primary-700 text-primary-800 px-4 py-2 rounded hover:bg-primary-700 hover:text-white"
        >
          메인으로 돌아가기
        </Link>
      </div>

      {showingModal && pending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-4">예약 상세 정보</h2>
            <p className="mb-2">
              <strong>숙소:</strong> {pending.lodge?.name || "이름 없는 숙소"}
            </p>
            <p className="mb-2">
              <strong>방 타입:</strong> {pending.roomType?.name || "정보 없음"}
            </p>
            <p className="mb-2">
              <strong>체크인:</strong> {pending.checkIn.slice(0, 10)}
            </p>
            <p className="mb-2">
              <strong>체크아웃:</strong> {pending.checkOut.slice(0, 10)}
            </p>
            <p className="mb-2">
              <strong>성인:</strong> {pending.adults}명
            </p>
            <p className="mb-2">
              <strong>어린이:</strong> {pending.children}명
            </p>
            <p className="mb-2">
              <strong>객실 수:</strong> {pending.roomCount}개
            </p>
            <p className="mb-2">
              <strong>예약일:</strong>{" "}
              {new Date(pending.createdAt).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>특별 요청:</strong>{" "}
              {parsedSpecialRequests(pending.specialRequests).length > 0
                ? parsedSpecialRequests(pending.specialRequests).join(", ")
                : "없음"}
            </p>
            <div className="mt-4">
              <button
                className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
                onClick={() => setShowingModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
