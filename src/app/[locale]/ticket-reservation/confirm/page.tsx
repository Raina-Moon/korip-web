"use client";

import { createTicketReservation } from "@/lib/ticket-reservation/ticketReservationThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ANONYMOUS, loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import toast from "react-hot-toast";
import type { TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";

const TicketReservationConfirmPage = () => {
  const { t } = useTranslation("ticket-reservation-confirm");
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);

  const locale = useLocale();

  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const totalPrice = searchParams.get("totalPrice");

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const phoneNumber = searchParams.get("phoneNumber") || "";
  const email = searchParams.get("email") || "";

  useEffect(() => {
    const initToss = async () => {
      if (!clientKey)
        throw new Error("Toss Payments client key is not defined.");
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

  const normalizeKoreanPhone = (phone: string) => {
    if (!phone) return "";

    let digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.startsWith("82")) {
      digitsOnly = digitsOnly.slice(2);
    }

    if (digitsOnly.startsWith("10")) {
      digitsOnly = "0" + digitsOnly;
    }

    if (!/^010\d{7,8}$/.test(digitsOnly)) {
      return "";
    }

    return digitsOnly;
  };

  const handleTossPayment = async () => {
    if (!widgets || !ready) return;

    try {
      const pending = JSON.parse(
        localStorage.getItem("pendingTicketReservation") || "{}"
      );

      const created = await dispatch(createTicketReservation(pending)).unwrap();
      const reservationId = created.id;

      const customerMobilePhone = normalizeKoreanPhone(phoneNumber);
      if (!customerMobilePhone) {
        toast.error(t("alertInvalidPhone"));
        return;
      }

      await widgets.requestPayment({
        orderId: `ticket-${Date.now()}`,
        orderName: "온천 티켓 예약",
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerMobilePhone,
        successUrl: `${locale}/ticket-reservation/success?reservationId=${reservationId}`,
        failUrl: `${locale}/ticket-reservation/fail`,
      });
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error(t("alertPaymentFail"));
      router.push(`/${locale}/ticket-reservation/fail`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      <p>
        {t("totalPrice")}:{" "}
        {totalPrice ? Number(totalPrice).toLocaleString() : "0"} KRW
      </p>
      <div id="payment-methods" />
      <div id="agreement" />

      <button
        disabled={!ready}
        onClick={handleTossPayment}
        className="bg-primary-700 text-white px-6 py-2 rounded hover:bg-primary-500"
      >
        {t("payNow")}
      </button>
    </div>
  );
};

export default TicketReservationConfirmPage;