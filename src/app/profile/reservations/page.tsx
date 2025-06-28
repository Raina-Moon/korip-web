"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchReservation } from "@/lib/reservation/reservationThunk";
import Link from "next/link";

export default function ReservationListPage() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.reservation);

  useEffect(() => {
    dispatch(fetchReservation());
  }, [dispatch]);

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
          >
            <h2 className="text-lg font-semibold mb-2">
              {reservation.lodge?.name || "이름 없는 숙소"}
            </h2>

            <p className="text-sm text-gray-700 mb-1">
              방 타입: {reservation.roomType?.name || "정보 없음"}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              체크인: {reservation.checkIn}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              체크아웃: {reservation.checkOut}
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
    </div>
  );
}
