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
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            {t("status.confirmed")}
          </span>
        );
      case "PENDING":
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            {t("status.pending")}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            {t("status.cancelled")}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
            {t("status.none")}
          </span>
        );
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onClick(reservation)}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-primary-700">
          {localizedLodgeName}
        </h2>
        {getStatusBadge(reservation.status)}
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          {t("roomType")}: {localizedRoomName}
        </p>
        <p className="text-sm text-gray-700">
          {t("checkIn")}: {reservation.checkIn.slice(0, 10)}
        </p>
        <p className="text-sm text-gray-700">
          {t("checkOut")}: {reservation.checkOut.slice(0, 10)}
        </p>
        <p className="text-sm text-gray-700">
          {t("adultsWithCount", { count: reservation.adults })},{" "}
          {t("childrenWithCount", { count: reservation.children })}
        </p>
        <p className="text-sm text-gray-700">
          {t("roomCountWithCount", { count: reservation.roomCount })}
        </p>
        <p className="text-sm text-gray-500">
          {t("createdAt", {
            date: new Date(reservation.createdAt).toLocaleString(),
          })}
        </p>
      </div>
    </div>
  );
}

export default ReservationCard;
