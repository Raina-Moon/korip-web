import { TicketReservation } from "@/types/ticketReservation";
import React from "react";

interface TicketReservationCardProps {
  ticket: TicketReservation;
  onClick?: (ticket: TicketReservation) => void;
}

const TicketReservationCard: React.FC<TicketReservationCardProps> = ({
  ticket,
  onClick,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="px-3 py-1 rounded border bg-green-600 text-white text-xs font-semibold">
            예약확정
          </span>
        );
      case "PENDING":
        return (
          <span className="px-3 py-1 rounded border bg-yellow-500 text-white text-xs font-semibold">
            진행중
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-3 py-1 rounded border bg-red-600 text-white text-xs font-semibold">
            예약취소
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded border text-gray-700 border-gray-700 text-xs font-semibold">
            상태 없음
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
          {ticket.ticketType?.name || "이름 없는 티켓"}
        </h2>
        {getStatusBadge(ticket.status)}
      </div>
      <p className="text-sm text-gray-700 mb-1">
        날짜: {ticket.date.slice(0, 10)}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        성인: {ticket.adults}명, 어린이: {ticket.children}명
      </p>
      <p className="text-sm text-gray-500">
        예약일: {new Date(ticket.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default TicketReservationCard;
