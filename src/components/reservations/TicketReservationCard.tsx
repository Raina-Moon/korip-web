import { TicketReservation } from "@/types/ticketReservation";
import { getLocalizedTicketTypeName } from "@/utils/getLocalizedTicketReservation";
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
  const { t, i18n } = useTranslation("ticket-reservation-card");

  const formatKSTDate = (utcDateStr: string) => {
    const utcDate = new Date(utcDateStr);
    const kst = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().slice(0, 10);
  };

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
      onClick?.(ticket);
    }
  };

  const ticketName =
    getLocalizedTicketTypeName(ticket, i18n.language) || t("modal.none");

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${ticketName} ${t("statusLabel", {
        status: ticket.status.toLowerCase(),
      })}`}
      onClick={() => onClick?.(ticket)}
      onKeyDown={handleKeyDown}
      className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-primary-700 truncate">
          {ticketName}
        </h2>
        <div className="shrink-0">{getStatusBadge(ticket.status)}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 sm:gap-y-2">
        <p className="text-sm sm:text-base text-gray-700">
          <span className="font-medium">{t("date")}:</span>{" "}
          {formatKSTDate(ticket.date)}
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          <span className="font-medium">
            {t("adultsWithCount", { count: ticket.adults })}
          </span>
          {", "}
          {t("childrenWithCount", { count: ticket.children })}
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          <span className="font-medium">
            {t("totalPriceLabel") || t("totalPrice", { price: "" })}
          </span>{" "}
          {(ticket.totalPrice?.toLocaleString() ?? t("notCalculated")) +
            (t("currencySuffix") || "원")}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 sm:col-span-2">
          {t("createdAt", {
            date: new Date(ticket.createdAt).toLocaleString(),
          })}
        </p>
      </div>
    </div>
  );
};

export default TicketReservationCard;
