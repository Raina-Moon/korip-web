import React from "react";
import { useTranslation } from "react-i18next";

function ReservationCard({
  reservation,
  onClick,
}: {
  reservation: any;
  onClick: (r: any) => void;
}) {
  const { t } = useTranslation("reservation-card");
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="px-3 py-1 rounded border bg-green-600 text-white text-xs font-semibold">
            {t("status.confirmed")}
          </span>
        );
      case "PENDING":
        return (
          <span className="px-3 py-1 rounded border bg-yellow-500 text-white text-xs font-semibold">
            {t("status.pending")}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-3 py-1 rounded border bg-red-600 text-white text-xs font-semibold">
            {t("status.cancelled")}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded border text-gray-700 border-gray-700 text-xs font-semibold">
            {t("status.none")}
          </span>
        );
    }
  };

  return (
    <div
      className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick(reservation)}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold mb-2">
          {reservation.lodge?.name || t("noName")}
        </h2>
        {getStatusBadge(reservation.status)}
      </div>
      <p className="text-sm text-gray-700 mb-1">
        {t("roomType")}: {reservation.roomType?.name || t("정보 없음")}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        {t("checkIn")}: {reservation.checkIn.slice(0, 10)}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        {t("checkOut")}: {reservation.checkOut.slice(0, 10)}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        {t("adultsWithCount", { count: reservation.adults })},{" "}
        {t("childrenWithCount", { count: reservation.children })}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        {t("roomCountWithUnit", { count: reservation.roomCount })}
      </p>
      <p className="text-sm text-gray-500">
        {t("createdAt", {
          date: new Date(reservation.createdAt).toLocaleString(),
        })}
      </p>
    </div>
  );
}

export default ReservationCard;
