"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  cancelReservation,
  fetchReservation,
} from "@/lib/reservation/reservationThunk";
import Link from "next/link";
import ReservationCard from "./ReservationCard";
import { fetchTicketReservations } from "@/lib/ticket-reservation/ticketReservationThunk";

export default function ReservationListPage() {
  const [showingModal, setShowingModal] = useState(false);
  const [pending, setPending] = useState<any | null>(null);
  const [filter, setFilter] = useState<
    "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED"
  >("ALL");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [agreeRefundPolicy, setAgreeRefundPolicy] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"LODGING" | "TICKET">("LODGING");
  const [ticketFilter, setTicketFilter] = useState<
    "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED"
  >("ALL");

  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((state) => state.reservation);
  const ticketState = useAppSelector((state) => state.ticketReservation);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    dispatch(fetchReservation());
    dispatch(fetchTicketReservations());
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

  const handleReservationCancel = async () => {
    if (!pending) return;
    setIsCancelling(true);
    try {
      await dispatch(
        cancelReservation({
          reservationId: pending.id,
          cancelReason: "USER_REQUESTED",
        })
      ).unwrap();
      setShowCancelModal(false);
      setShowingModal(false);
      dispatch(fetchReservation());
    } catch (err) {
      alert("예약 취소 중 오류가 발생했습니다.");
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredList =
    filter === "ALL" ? list : list.filter((r) => r.status === filter);

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const filteredTicketList =
    ticketFilter === "ALL"
      ? ticketState.list
      : ticketState.list.filter((t) => t.status === ticketFilter);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">내 예약 목록</h1>

      {loading && <p className="text-gray-600">불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && list.length === 0 && (
        <p className="text-gray-700">예약 내역이 없습니다.</p>
      )}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTypeFilter("LODGING")}
          className={`px-4 py-2 rounded border ${
            typeFilter === "LODGING"
              ? "bg-primary-700 text-white"
              : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
          }`}
        >
          숙소 예약
        </button>
        <button
          onClick={() => setTypeFilter("TICKET")}
          className={`px-4 py-2 rounded border ${
            typeFilter === "TICKET"
              ? "bg-primary-700 text-white"
              : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
          }`}
        >
          티켓 예약
        </button>
      </div>

      {typeFilter === "LODGING" ? (
        <>
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
            <div className="space-y-4">
              {filteredList.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onClick={openModal}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setTicketFilter("ALL")}
              className={`px-3 py-1 rounded border ${
                ticketFilter === "ALL"
                  ? "bg-primary-700 text-white"
                  : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setTicketFilter("PENDING")}
              className={`px-3 py-1 rounded border ${
                ticketFilter === "PENDING"
                  ? "bg-yellow-500 text-white"
                  : "text-yellow-700 border-yellow-700 hover:bg-yellow-700 hover:text-white"
              }`}
            >
              진행중
            </button>
            <button
              onClick={() => setTicketFilter("CONFIRMED")}
              className={`px-3 py-1 rounded border ${
                ticketFilter === "CONFIRMED"
                  ? "bg-green-600 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-700 hover:text-white"
              }`}
            >
              예약확정
            </button>
            <button
              onClick={() => setTicketFilter("CANCELLED")}
              className={`px-3 py-1 rounded border ${
                ticketFilter === "CANCELLED"
                  ? "bg-red-600 text-white"
                  : "text-red-700 border-red-700 hover:bg-red-700 hover:text-white"
              }`}
            >
              예약취소
            </button>
          </div>

          {!ticketState.loading && filteredTicketList.length === 0 && (
            <p className="text-gray-700">
              해당 조건의 티켓 예약 내역이 없습니다.
            </p>
          )}

          {!ticketState.loading && filteredTicketList.length > 0 && (
            <div className="space-y-4">
              {filteredTicketList.map((ticket) => (
                <div
                  key={ticket.id}
                  className="relative border border-gray-300 rounded p-4 shadow-sm"
                >
                  <span
                    className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded ${
                      ticket.status === "PENDING"
                        ? "bg-yellow-400 text-yellow-900"
                        : ticket.status === "CONFIRMED"
                        ? "bg-green-500 text-white"
                        : ticket.status === "CANCELLED"
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {ticket.status === "PENDING"
                      ? "진행중"
                      : ticket.status === "CONFIRMED"
                      ? "예약확정"
                      : ticket.status === "CANCELLED"
                      ? "예약취소"
                      : ticket.status}
                  </span>
                  <p className="font-semibold text-lg">
                    {ticket.ticketType?.name}
                  </p>
                  <p>날짜: {ticket.date}</p>
                  <p>
                    성인: {ticket.adults}명, 어린이: {ticket.children}명
                  </p>
                  <p>예약 상태: {ticket.status}</p>
                  <p className="text-sm text-gray-500">
                    예약일: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
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
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
              <h2 className="text-lg font-semibold mb-4">예약 상세 정보</h2>

              {pending.roomType?.images?.[0] && (
                <img
                  src={
                    typeof pending.roomType.images[0] === "string"
                      ? pending.roomType.images[0]
                      : pending.roomType.images[0]?.imageUrl
                  }
                  alt="Room Image"
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}

              <p className="mb-2">
                <strong>숙소:</strong>{" "}
                {pending.lodge?.id ? (
                  <Link
                    href={{
                      pathname: `/lodge/${pending.lodge.id}`,
                      query: {
                        roomTypeId: pending.roomType.id,
                        checkIn: formatDate(today),
                        checkOut: formatDate(tomorrow),
                        adults: 1,
                        children: 0,
                        roomCount: 1,
                      },
                    }}
                    className="text-primary-700 underline hover:text-primary-900"
                    onClick={() => setShowingModal(false)}
                  >
                    {pending.lodge?.name || "이름 없는 숙소"}
                  </Link>
                ) : (
                  pending.lodge?.name || "이름 없는 숙소"
                )}
              </p>

              <p className="mb-2">
                <strong>방 타입:</strong>{" "}
                {pending.roomType?.name || "정보 없음"}
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
              {pending && pending.status === "CONFIRMED" && (
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
                  onClick={() => setShowCancelModal(true)}
                >
                  예약 취소
                </button>
              )}
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
        </>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">환불 규정 및 취소 동의</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
              {`■ 환불 규정
- 체크인 7일 전 취소 시: 전액 환불
- 체크인 24시간 초과 ~ 7일 이내 취소 시: 50% 환불
- 체크인 24시간 이내 취소 시: 환불 불가
`}
            </p>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={agreeRefundPolicy}
                onChange={(e) => setAgreeRefundPolicy(e.target.checked)}
              />
              <span className="text-sm text-gray-800">
                위 환불 정책을 읽고 동의합니다.
              </span>
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                닫기
              </button>
              <button
                disabled={!agreeRefundPolicy || isCancelling}
                onClick={handleReservationCancel}
                className={`px-4 py-2 rounded ${
                  agreeRefundPolicy
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isCancelling ? "취소 처리중..." : "예약 취소"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
