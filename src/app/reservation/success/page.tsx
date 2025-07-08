"use client";

import { confirmReservation } from "@/lib/reservation/reservationThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { getNights } from "@/utils/getNights";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ReservationSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<any>(null);

  const reservationId = searchParams.get("reservationId");

  const dispatch = useAppDispatch();

  useEffect(() => {
    const data = localStorage.getItem("pendingReservation") || "{}";
    if (data) {
      setPending(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (reservationId) {
      dispatch(confirmReservation({ reservationId: Number(reservationId) }));
    }
  }, [reservationId]);

  
  if (!pending || !pending.checkIn || !pending.checkOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold text-primary-800">예약 처리 중...</h1>
        <p className="text-lg text-gray-700 mb-6">잠시만 기다려주세요.</p>
      </div>
    );
  }
  
  const nights = getNights(pending.checkIn, pending.checkOut);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-primary-800">예약 확정 🎉</h1>
      <p className="text-lg text-gray-700 mb-6">아래 내용을 확인해주세요.</p>

      <div className="w-full max-w-3xl border rounded-lg shadow bg-white">
        <table className="min-w-full border-collapse">
          <tbody>
            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                숙소 정보
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">숙소</td>
              <td className="py-2 px-4">{pending.lodgeName}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">룸 타입</td>
              <td className="py-2 px-4">{pending.roomName}</td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                숙박 일정
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">체크인</td>
              <td className="py-2 px-4">{pending.checkIn}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">체크아웃</td>
              <td className="py-2 px-4">{pending.checkOut}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">숙박일수</td>
              <td className="py-2 px-4">{nights}박</td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                투숙 인원
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">성인</td>
              <td className="py-2 px-4">{pending.adults}명</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">어린이</td>
              <td className="py-2 px-4">{pending.children}명</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">객실 수</td>
              <td className="py-2 px-4">{pending.roomCount}개</td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                예약자 정보
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">이름</td>
              <td className="py-2 px-4">
                {pending.lastName} {pending.firstName}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">이메일</td>
              <td className="py-2 px-4">{pending.email}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">휴대폰</td>
              <td className="py-2 px-4">{pending.phoneNumber}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">국적</td>
              <td className="py-2 px-4">{pending.nationality}</td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                요청사항
              </td>
            </tr>
            {pending.specialRequests?.length > 0 ? (
              pending.specialRequests.map((req: string, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4 font-medium bg-gray-50">{`요청 ${
                    idx + 1
                  }`}</td>
                  <td className="py-2 px-4">{req}</td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="py-2 px-4 font-medium bg-gray-50">요청</td>
                <td className="py-2 px-4">없음</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => router.push("/")}
          className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-white hover:border hover:border-primary-700 hover:text-primary-700 cursor-pointer"
        >
          홈으로 가기
        </button>
        <button
          onClick={() => router.push("/profile/reservations")}
          className="border border-primary-700 text-primary-800 px-4 py-2 rounded hover:bg-primary-700 hover:text-white cursor-pointer"
        >
          예약 리스트 보러가기
        </button>
      </div>
    </div>
  );
};

export default ReservationSuccessPage;
