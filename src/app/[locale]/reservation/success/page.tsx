"use client";

import { confirmReservation } from "@/lib/reservation/reservationThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { getNights } from "@/utils/getNights";
import { useLocale } from "@/utils/useLocale";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Home, Calendar, Users, User, MessageSquare } from "lucide-react";

interface PendingReservation {
  lodgeId: number;
  roomTypeId: number;
  lodgeName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomCount: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string | null;
  nationality?: string | null;
  specialRequests?: string | null;
}

const ReservationSuccessPage = () => {
  const { t, i18n } = useTranslation("reservation-success");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<PendingReservation | null>(null);

  const lodgeName = pending?.lodgeName || "Unknown Lodge";
  const roomName = pending?.roomName || "Unknown Room";

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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-800">
          {t("loading.title")}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mt-2">
          {t("loading.message")}
        </p>
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-800">
          {t("success.title")}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mt-2">
          {t("success.subtitle")}
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
        {/* Lodge Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Home className="w-5 h-5 text-primary-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {t("success.sections.lodge")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.lodge")}
              </span>
              <p className="text-gray-800">{lodgeName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.roomType")}
              </span>
              <p className="text-gray-800">{roomName}</p>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-primary-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {t("success.sections.schedule")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.checkIn")}
              </span>
              <p className="text-gray-800">{pending.checkIn}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.checkOut")}
              </span>
              <p className="text-gray-800">{pending.checkOut}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.nights")}
              </span>
              <p className="text-gray-800">
                {t("success.labels.nightsWithUnit", { count: Number(nights) })}
              </p>
            </div>
          </div>
        </div>

        {/* Guests Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-primary-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {t("success.sections.guests")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.adults")}
              </span>
              <p className="text-gray-800">
                {t("success.labels.adultsWithUnit", { count: pending.adults })}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.children")}
              </span>
              <p className="text-gray-800">
                {t("success.labels.childrenWithUnit", {
                  count: pending.children,
                })}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.roomCount")}
              </span>
              <p className="text-gray-800">
                {t("success.labels.roomsWithUnit", {
                  count: pending.roomCount,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-primary-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {t("success.sections.user")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.name")}
              </span>
              <p className="text-gray-800">
                {pending.lastName} {pending.firstName}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.email")}
              </span>
              <p className="text-gray-800">{pending.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.phone")}
              </span>
              <p className="text-gray-800">{pending.phoneNumber}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.nationality")}
              </span>
              <p className="text-gray-800">{pending.nationality}</p>
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-5 h-5 text-primary-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {t("success.sections.requests")}
            </h2>
          </div>
          {requests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {requests.map((req, idx) => (
                <div key={idx}>
                  <span className="text-sm font-medium text-gray-500">{`요청 ${
                    idx + 1
                  }`}</span>
                  <p className="text-gray-800">{req}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <span className="text-sm font-medium text-gray-500">
                {t("success.labels.request")}
              </span>
              <p className="text-gray-800">{t("success.labels.requestNone")}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={() => router.push(`/${locale}`)}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all duration-200"
          aria-label={t("success.buttons.goHome")}
        >
          {t("success.buttons.goHome")}
        </button>
        <button
          onClick={() => router.push(`/${locale}/profile/reservations`)}
          className="border border-primary-500 text-primary-500 px-6 py-3 rounded-lg hover:bg-primary-500 hover:text-white focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all duration-200"
          aria-label={t("success.buttons.goToReservations")}
        >
          {t("success.buttons.goToReservations")}
        </button>
      </div>
    </div>
  );
};

export default ReservationSuccessPage;
