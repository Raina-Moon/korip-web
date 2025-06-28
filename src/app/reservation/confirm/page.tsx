"use client";

import { createReservation } from "@/lib/reservation/reservationThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  ANONYMOUS,
  loadTossPayments,
} from "@tosspayments/tosspayments-sdk";

const ReservationConfirmPage = () => {
  const [widgets, setWidgets] = useState<any>(null);
  const [ready, setReady] = useState(false);

  const searchParams = useSearchParams();
  const totalPrice = searchParams.get("totalPrice");
  const lodgeId = searchParams.get("lodgeId");

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";

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

  useEffect(() => {
    const initToss = async () => {
      if (!clientKey) {
        throw new Error("Toss Payments client key is not defined.");
      }
      const tossPayment = await loadTossPayments(clientKey);
      const widget = tossPayment.widgets({ customerKey: ANONYMOUS });

      setWidgets(widget);
    };
    initToss();
  }, []);

  useEffect(() => {
    const render = async () => {
      if (!widgets) return;

      await widgets.setAmount({ value: Number(totalPrice), currency: "KRW" });

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: "#payment-methods",
          variantKey: "DEFAULT",
        }),
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    };
    render();
  }, [widgets]);

  useEffect(() => {
    const pending = JSON.parse(
      localStorage.getItem("pendingReservation") || "[]"
    );

    dispatch(createReservation(pending));
  }, []);

  const handleTossPayment = async () => {
    if (!widgets || !ready) return;

    try {
      const paymentResult = await widgets.requestPayment({
        orderId: `reservation-${Date.now()}`,
        orderName: "숙소 예약",
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerMobilePhone: phoneNumber,
        successUrl: `${window.location.origin}/reservation/success?`,
        failUrl: `${window.location.origin}/reservation/fail?lodgeId=${lodgeId}`,
      });

      console.log("Payment successful:", paymentResult);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("결제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">예약 최종 확인</h1>
      <p>
        총 결제 금액: {totalPrice ? Number(totalPrice).toLocaleString() : "0"}원
      </p>

      <div id="payment-methods" />
      <div id="agreement" />

      <button
        disabled={!ready}
        onClick={handleTossPayment}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
      >
        결제하기 (Toss)
      </button>
    </div>
  );
};

export default ReservationConfirmPage;
