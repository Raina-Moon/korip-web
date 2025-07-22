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
      onClick={() => onClick?.(ticket)}
      className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold mb-2">
          {ticket.ticketType?.name || t("noName")}
        </h2>
        {getStatusBadge(ticket.status)}
      </div>
      <p className="text-sm text-gray-700 mb-1">
        {t("date", { date: formatKSTDate(ticket.date) })}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        {t("adultsWithCount", { count: ticket.adults })},{" "}
        {t("childrenWithCount", { count: ticket.children })}
      </p>
      <p className="text-sm text-gray-500">
        {t("createdAt", { date: new Date(ticket.createdAt).toLocaleString() })}
      </p>
    </div>
  );
};

export default TicketReservationCard;
