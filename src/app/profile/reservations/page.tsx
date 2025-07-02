"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchReservation } from "@/lib/reservation/reservationThunk";
import Link from "next/link";
import ReservationCard from "./ReservationCard";

export default function ReservationListPage() {
  const [showingModal, setShowingModal] = useState(false);
  const [pending, setPending] = useState<any | null>(null);
  const [filter, setFilter] = useState<
    "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED"
  >("ALL");

  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.reservation);

  const confirmedList = list.filter((r) => r.status === "CONFIRMED");
  const pendingList = list.filter((r) => r.status === "PENDING");
  const cancelledList = list.filter((r) => r.status === "CANCELLED");

  useEffect(() => {
    dispatch(fetchReservation());
  }, [dispatch]);

  const openModal = (reservation: any) => {
    setShowingModal(true);
    setPending(reservation);
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

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1 rounded border ${
            filter === "ALL"
              ? "bg-primary-700 text-white"
              : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter("PENDING")}
          className={`px-3 py-1 rounded border ${
            filter === "PENDING"
              ? "bg-yellow-500 text-white"
              : "text-yellow-700 border-yellow-700 hover:bg-yellow-700 hover:text-white"
          }`}
        >
          진행중
        </button>
        <button
          onClick={() => setFilter("CONFIRMED")}
          className={`px-3 py-1 rounded border ${
            filter === "CONFIRMED"
              ? "bg-green-600 text-white"
              : "text-green-700 border-green-700 hover:bg-green-700 hover:text-white"
          }`}
        >
          예약확정
        </button>
        <button
          onClick={() => setFilter("CANCELLED")}
          className={`px-3 py-1 rounded border ${
            filter === "CANCELLED"
              ? "bg-red-600 text-white"
              : "text-red-700 border-red-700 hover:bg-red-700 hover:text-white"
          }`}
        >
          예약취소
        </button>
      </div>

      {!loading && !error && (
        <>
          {confirmedList.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-green-700">
                ✅ 예약 확정
              </h2>
              <div className="space-y-4">
                {confirmedList.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onClick={openModal}
                  />
                ))}
              </div>
            </div>
          )}

          {pendingList.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-yellow-700">
                ⏳ 진행중
              </h2>
              <div className="space-y-4">
                {pendingList.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onClick={openModal}
                  />
                ))}
              </div>
            </div>
          )}

          {cancelledList.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-red-700">
                ❌ 취소됨
              </h2>
              <div className="space-y-4">
                {cancelledList.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onClick={openModal}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        <Link
          href="/profile"
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
