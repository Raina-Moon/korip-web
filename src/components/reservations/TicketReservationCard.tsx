import { TicketReservation } from "@/types/ticketReservation";
import React from "react";
import { useTranslation } from "react-i18next";

interface TicketReservationCardProps {
  ticket: TicketReservation;
  onClick?: (ticket: TicketReservation) => void;
}

const TicketReservationCard: React.FC<TicketReservationCardProps> = ({
  ticket,
  onClick,
}) => {
  const { t } = useTranslation("ticket-reservation-card");
  const formatKSTDate = (utcDateStr: string) => {
    const utcDate = new Date(utcDateStr);
    const kst = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().slice(0, 10);
  };

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
      onClick={() => onClick?.(ticket)}
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-primary-700">
          {ticket.ticketType?.name || t("noName")}
        </h2>
        {getStatusBadge(ticket.status)}
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          {t("date", { date: formatKSTDate(ticket.date) })}
        </p>
        <p className="text-sm text-gray-700">
          {t("adultsWithCount", { count: ticket.adults })},{" "}
          {t("childrenWithCount", { count: ticket.children })}
        </p>
        <p className="text-sm text-gray-700">
          {t("totalPrice", {
            price: ticket.totalPrice?.toLocaleString() || "계산 안됨",
          })}
          원
        </p>
        <p className="text-sm text-gray-500">
          {t("createdAt", {
            date: new Date(ticket.createdAt).toLocaleString(),
          })}
        </p>
      </div>
    </div>
  );
};

export default TicketReservationCard;
