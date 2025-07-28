
"use client";
export const runtime = 'edge';

import { useAppDispatch } from "@/lib/store/hooks";
import { confirmTicketReservation } from "@/lib/ticket-reservation/ticketReservationThunk";
import { TicketReservation } from "@/types/ticketReservation";
import { useLocale } from "@/utils/useLocale";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TicketReservationSuccessPage = () => {
  const { t } = useTranslation("ticket-success");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<Partial<TicketReservation> | null>(
    null
  );

  const reservationId = searchParams.get("reservationId");

  const dispatch = useAppDispatch();

  const locale = useLocale();

  useEffect(() => {
    const data = localStorage.getItem("pendingTicketReservation") || "{}";
    if (data) {
      setPending(JSON.parse(data) as Partial<TicketReservation>);
    }
  }, []);

  useEffect(() => {
    if (reservationId) {
      dispatch(
        confirmTicketReservation({ reservationId: Number(reservationId) })
      );
    }
  }, [reservationId]);

  if (!pending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold text-primary-800">
          {t("loadingTitle")}
        </h1>
        <p className="text-lg text-gray-700 mb-6">{t("loadingDesc")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-primary-800">{t("title")}</h1>
      <p className="text-lg text-gray-700 mb-6">{t("description")}</p>

      <div className="w-full max-w-3xl border rounded-lg shadow bg-white">
        <table className="min-w-full border-collapse">
          <tbody>
            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                {t("ticketInfo")}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">{t("lodge")}</td>
              <td className="py-2 px-4">{pending.ticketType?.lodge.name}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">{t("date")}</td>
              <td className="py-2 px-4">{pending.date}</td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                {t("guestInfo")}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("adults")}
              </td>
              <td className="py-2 px-4">
                {t("adultsWithUnit", { count: pending.adults })}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("children")}
              </td>
              <td className="py-2 px-4">
                {t("childrenWithUnit", { count: pending.children })}
              </td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                {t("userInfo")}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">{t("name")}</td>
              <td className="py-2 px-4">
                {pending.lastName} {pending.firstName}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">{t("email")}</td>
              <td className="py-2 px-4">{pending.email}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">{t("phone")}</td>
              <td className="py-2 px-4">{pending.phoneNumber}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("nationality")}
              </td>
              <td className="py-2 px-4">{pending.nationality}</td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                {t("requestInfo")}
              </td>
            </tr>
            {Array.isArray(pending.specialRequests) &&
            pending.specialRequests.length > 0 ? (
              pending.specialRequests.map((req: string, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4 font-medium bg-gray-50">{`요청 ${
                    idx + 1
                  }`}</td>
                  <td className="py-2 px-4">{req}</td>
                </tr>
              ))
            ) : pending.specialRequests ? (
              // specialRequests가 string 하나일 때
              <tr className="border-t">
                <td className="py-2 px-4 font-medium bg-gray-50">요청 1</td>
                <td className="py-2 px-4">{pending.specialRequests}</td>
              </tr>
            ) : (
              <tr className="border-t">
                <td className="py-2 px-4 font-medium bg-gray-50">
                  {t("request")} 1
                </td>
                <td className="py-2 px-4">{t("none")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => router.push(`/${locale}/`)}
          className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-white hover:border hover:border-primary-700 hover:text-primary-700 cursor-pointer"
        >
          {t("goHome")}
        </button>
        <button
          onClick={() => router.push(`/${locale}/profile/reservations`)}
          className="border border-primary-700 text-primary-800 px-4 py-2 rounded hover:bg-primary-700 hover:text-white cursor-pointer"
        >
          {t("viewReservations")}
        </button>
      </div>
    </div>
  );
};

export default TicketReservationSuccessPage;