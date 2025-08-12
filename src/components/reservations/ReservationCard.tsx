import { Reservation } from "@/types/reservation";
import {
  getLocalizedReservationLodgeName,
  getLocalizedReservationRoomName,
} from "@/utils/getLocalizedReservField";
import React from "react";
import { useTranslation } from "react-i18next";

function ReservationCard({
  reservation,
  onClick,
}: {
  reservation: Reservation;
  onClick: (r: Reservation) => void;
}) {
  const { t, i18n } = useTranslation("reservation-card");

  const localizedLodgeName = getLocalizedReservationLodgeName(
    reservation,
    i18n.language
  );
  const localizedRoomName = getLocalizedReservationRoomName(
    reservation,
    i18n.language
  );

  const getStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium";
    switch (status) {
      case "CONFIRMED":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            {t("status.confirmed")}
          </span>
        );
      case "PENDING":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            {t("status.pending")}
          </span>
        );
      case "CANCELLED":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>
            {t("status.cancelled")}
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>
            {t("status.none")}
          </span>
        );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(reservation);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${localizedLodgeName} ${t("statusLabel", {
        status: reservation.status.toLowerCase(),
      })}`}
      className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      onClick={() => onClick(reservation)}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-primary-700 truncate">
          {localizedLodgeName}
        </h2>
        <div className="shrink-0">{getStatusBadge(reservation.status)}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 sm:gap-y-2">
        <p className="text-sm sm:text-base text-gray-700 truncate">
          <span className="font-medium">{t("roomType")}:</span>{" "}
          {localizedRoomName}
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          <span className="font-medium">{t("checkIn")}:</span>{" "}
          {reservation.checkIn.slice(0, 10)}
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          <span className="font-medium">{t("checkOut")}:</span>{" "}
          {reservation.checkOut.slice(0, 10)}
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          <span className="font-medium">
            {t("adultsWithCount", { count: reservation.adults })}
          </span>
          {", "}
          {t("childrenWithCount", { count: reservation.children })}
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          <span className="font-medium">
            {t("roomCountWithCount", { count: reservation.roomCount })}
          </span>
        </p>
        <p className="text-xs sm:text-sm text-gray-500 sm:col-span-2">
          {t("createdAt", {
            date: new Date(reservation.createdAt).toLocaleString(),
          })}
        </p>
      </div>
    </div>
  );
}

export default ReservationCard;
