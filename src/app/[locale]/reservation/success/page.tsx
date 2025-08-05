"use client";

import { confirmReservation } from "@/lib/reservation/reservationThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { Reservation } from "@/types/reservation";
import { getNights } from "@/utils/getNights";
import { useLocale } from "@/utils/useLocale";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ReservationSuccessPage = () => {
  const { t } = useTranslation("reservation-success");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<Reservation | null>(null);

  const reservationId = searchParams.get("reservationId");

  const dispatch = useAppDispatch();

  const locale = useLocale();

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
        <h1 className="text-3xl font-bold text-primary-800">
          {t("loading.title")}
        </h1>
        <p className="text-lg text-gray-700 mb-6">{t("loading.message")}</p>
      </div>
    );
  }

  const nights = getNights(pending.checkIn, pending.checkOut);

  const parseSpecialRequests = (sr?: string | null): string[] => {
    if (!sr) return [];
    try {
      if (Array.isArray(sr)) return sr;
      const parsed = JSON.parse(sr);
      return Array.isArray(parsed) ? parsed : [sr];
    } catch {
      return [sr];
    }
  };

  const requests = parseSpecialRequests(pending.specialRequests);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-primary-800">
        {t("success.title")}
      </h1>
      <p className="text-lg text-gray-700 mb-6">{t("success.subtitle")}</p>

      <div className="w-full max-w-3xl border rounded-lg shadow bg-white">
        <table className="min-w-full border-collapse">
          <tbody>
            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                {t("success.sections.lodge")}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.lodge")}
              </td>
              <td className="py-2 px-4">{pending.lodge.name}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.roomType")}
              </td>
              <td className="py-2 px-4">{pending.roomType.name}</td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                {t("success.sections.schedule")}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.checkIn")}
              </td>
              <td className="py-2 px-4">{pending.checkIn}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.checkOut")}
              </td>
              <td className="py-2 px-4">{pending.checkOut}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.nights")}
              </td>
              <td className="py-2 px-4">
                {" "}
                {t("success.labels.nightsWithUnit", { count: Number(nights) })}
              </td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                {t("success.sections.guests")}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.adults")}
              </td>
              <td className="py-2 px-4">
                {t("success.labels.adultsWithUnit", { count: pending.adults })}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.children")}
              </td>
              <td className="py-2 px-4">
                {t("success.labels.childrenWithUnit", {
                  count: pending.children,
                })}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.roomCount")}
              </td>
              <td className="py-2 px-4">
                {t("success.labels.roomsWithUnit", {
                  count: pending.roomCount,
                })}
              </td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                {t("success.sections.user")}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.name")}
              </td>
              <td className="py-2 px-4">
                {pending.lastName} {pending.firstName}
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.email")}
              </td>
              <td className="py-2 px-4">{pending.email}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.phone")}
              </td>
              <td className="py-2 px-4">{pending.phoneNumber}</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4 font-medium bg-gray-50">
                {t("success.labels.nationality")}
              </td>
              <td className="py-2 px-4">{pending.nationality}</td>
            </tr>

            <tr className="bg-gray-100">
              <td colSpan={2} className="py-3 px-4 font-semibold text-lg">
                {t("success.sections.requests")}
              </td>
            </tr>
            {requests.length > 0 ? (
              requests.map((req, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4 font-medium bg-gray-50">{`요청 ${
                    idx + 1
                  }`}</td>
                  <td className="py-2 px-4">{req}</td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="py-2 px-4 font-medium bg-gray-50">
                  {t("success.labels.request")}
                </td>
                <td className="py-2 px-4">{t("success.labels.requestNone")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => router.push(`/${locale}`)}
          className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-white hover:border hover:border-primary-700 hover:text-primary-700 cursor-pointer"
        >
          {t("success.buttons.goHome")}
        </button>
        <button
          onClick={() => router.push(`/${locale}/profile/reservations`)}
          className="border border-primary-700 text-primary-800 px-4 py-2 rounded hover:bg-primary-700 hover:text-white cursor-pointer"
        >
          {t("success.buttons.goToReservations")}
        </button>
      </div>
    </div>
  );
};

export default ReservationSuccessPage;
