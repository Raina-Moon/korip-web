"use client";

import { createReservation } from "@/lib/reservation/reservationThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const ReservationConfirmPage = () => {
  const searchParams = useSearchParams();
  const totalPrice = searchParams.get("totalPrice");
  const lodgeId = searchParams.get("lodgeId");

  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const nationality = searchParams.get("nationality") || "";
  const phoneNumber = searchParams.get("phoneNumber") || "";
  const email = searchParams.get("email") || "";
  const specialRequests = JSON.parse(
    searchParams.get("specialRequests") || "[]"
  );
  const customRequest = searchParams.get("customRequest") || "";

  const dispatch = useAppDispatch();

  const handleTossPayment = async () => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    const tossPayments = (window as any).TossPayments(clientKey);

    try {
      await tossPayments.requestPayment("카드", {
        amount: Number(totalPrice),
        orderId: `order-${Date.now()}`,
        orderName: "온천 숙소 예약",
        customerName:
          `${searchParams.get("firstName") || ""} ${
            searchParams.get("lastName") || ""
          }`.trim() || "고객",
        successUrl: `${window.location.origin}/reservation/success`,
        failUrl: `${window.location.origin}/reservation/fail?lodgeId=${lodgeId}`,
      });

      console.log("amount", Number(totalPrice));
      console.log("customerName", `${searchParams.get("firstName") || ""} ${searchParams.get("lastName") || ""}`.trim() || "고객");
      console.log("orderId", `order-${Date.now()}`);
    } catch (error) {
      alert("결제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const pending = JSON.parse(
      localStorage.getItem("pendingReservation") || "[]"
    );

    const fullReservationData = {
      ...pending,
      firstName,
      lastName,
      nationality,
      phoneNumber,
      email,
      specialRequests: [...specialRequests, customRequest].filter(Boolean),
    };

    console.log("Creating reservation with data:", fullReservationData);

    dispatch(createReservation(fullReservationData));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">예약 최종 확인</h1>
      <p>
        총 결제 금액: {totalPrice ? Number(totalPrice).toLocaleString() : "0"}원
      </p>

      <button
        onClick={handleTossPayment}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
      >
        결제하기 (Toss)
      </button>
    </div>
  );
};

export default ReservationConfirmPage;
