"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  cancelReservation,
  fetchReservation,
} from "@/lib/reservation/reservationThunk";
import Link from "next/link";
import ReservationCard from "../../../../components/reservations/ReservationCard";
import {
  cancelTicketReservation,
  fetchTicketReservations,
} from "@/lib/ticket-reservation/ticketReservationThunk";
import TicketReservationCard from "../../../../components/reservations/TicketReservationCard";
import { TicketReservation } from "@/types/ticketReservation";
import { useTranslation } from "react-i18next";

export default function ReservationListPage() {
  const { t } = useTranslation("reservations");
  const [showingModal, setShowingModal] = useState(false);
  const [pending, setPending] = useState<any | null>(null);
  const [filter, setFilter] = useState<
    "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED"
  >("ALL");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [agreeRefundPolicy, setAgreeRefundPolicy] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"LODGING" | "TICKET">("LODGING");
  const [ticketFilter, setTicketFilter] = useState<
    "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED"
  >("ALL");
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState<TicketReservation | null>(null);
  const [showTicketCancelModal, setShowTicketCancelModal] = useState(false);
  const [agreeTicketRefundPolicy, setAgreeTicketRefundPolicy] = useState(false);
  const [isTicketCancelling, setIsTicketCancelling] = useState(false);
  const [ticketCurrentPage, setTicketCurrentPage] = useState(1);
  const [lodgeCurrentPage, setLodgeCurrentPage] = useState(1);

  const dispatch = useAppDispatch();
  const { list, loading, error, totalPages } = useAppSelector(
    (state) => state.reservation
  );
  const ticketState = useAppSelector((state) => state.ticketReservation);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    dispatch(
      fetchReservation({
        page: lodgeCurrentPage,
        status: filter === "ALL" ? undefined : filter,
      })
    );
    dispatch(
      fetchTicketReservations({
        page: ticketCurrentPage,
        status: ticketFilter === "ALL" ? undefined : ticketFilter,
      })
    );
  }, [dispatch, ticketCurrentPage, ticketFilter, lodgeCurrentPage, filter]);

  useEffect(() => {
    setLodgeCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    setTicketCurrentPage(1);
  }, [ticketFilter]);

  useEffect(() => {
    setLodgeCurrentPage(1);
    setTicketCurrentPage(1);
  }, [typeFilter]);

  const openModal = (reservation: any) => {
    setShowingModal(true);
    setPending(reservation);
  };

  const parsedSpecialRequests = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const handleReservationCancel = async () => {
    if (!pending) return;
    setIsCancelling(true);
    try {
      await dispatch(
        cancelReservation({
          reservationId: pending.id,
          cancelReason: "USER_REQUESTED",
        })
      ).unwrap();
      setShowCancelModal(false);
      setShowingModal(false);
      dispatch(
        fetchReservation({
          page: lodgeCurrentPage,
          status: filter === "ALL" ? undefined : filter,
        })
      );
    } catch (err) {
      alert(t("alert.cancelFailed"));
    } finally {
      setIsCancelling(false);
    }
  };

  const handleTicketCancel = async () => {
    if (!selectedTicket) return;
    setIsTicketCancelling(true);
    try {
      await dispatch(
        cancelTicketReservation({
          reservationId: selectedTicket.id,
          cancelReason: "USER_REQUESTED",
        })
      ).unwrap();
      setShowTicketCancelModal(false);
      setTicketModalOpen(false);
      dispatch(fetchTicketReservations({ page: ticketCurrentPage }));
      alert(t("alert.ticketCancelSuccess"));
    } catch (err) {
      alert(t("alert.ticketCancelFailed"));
    } finally {
      setIsTicketCancelling(false);
    }
  };

  const filteredList =
    filter === "ALL" ? list : list.filter((r) => r.status === filter);

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const filteredTicketList =
    ticketFilter === "ALL"
      ? ticketState.list
      : ticketState.list.filter((t) => t.status === ticketFilter);

  const openTicketModal = (ticket: TicketReservation) => {
    setSelectedTicket(ticket);
    setTicketModalOpen(true);
  };

  const formatKSTDate = (utcDateStr: string) => {
    const utcDate = new Date(utcDateStr);
    const kst = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().slice(0, 10);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {loading && <p className="text-gray-600">{t("loading")}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && list.length === 0 && (
        <p className="text-gray-700">{t("empty")}</p>
      )}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTypeFilter("LODGING")}
          className={`px-4 py-2 rounded border ${
            typeFilter === "LODGING"
              ? "bg-primary-700 text-white"
              : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
          }`}
        >
          {t("lodgingTab")}
        </button>
        <button
          onClick={() => setTypeFilter("TICKET")}
          className={`px-4 py-2 rounded border ${
            typeFilter === "TICKET"
              ? "bg-primary-700 text-white"
              : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
          }`}
        >
          {t("ticketTab")}
        </button>
      </div>

      {typeFilter === "LODGING" ? (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded border ${
                filter === "ALL"
                  ? "bg-primary-700 text-white"
                  : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
              }`}
            >
              {t("filter.all")}
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1 rounded border ${
                filter === "PENDING"
                  ? "bg-yellow-500 text-white"
                  : "text-yellow-700 border-yellow-700 hover:bg-yellow-700 hover:text-white"
              }`}
            >
              {t("filter.pending")}
            </button>
            <button
              onClick={() => setFilter("CONFIRMED")}
              className={`px-3 py-1 rounded border ${
                filter === "CONFIRMED"
                  ? "bg-green-600 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-700 hover:text-white"
              }`}
            >
              {t("filter.confirmed")}
            </button>
            <button
              onClick={() => setFilter("CANCELLED")}
              className={`px-3 py-1 rounded border ${
                filter === "CANCELLED"
                  ? "bg-red-600 text-white"
                  : "text-red-700 border-red-700 hover:bg-red-700 hover:text-white"
              }`}
            >
              {t("filter.cancelled")}
            </button>
          </div>

          {!loading && !error && (
            <div className="space-y-4">
              {filteredList.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onClick={openModal}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setLodgeCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    lodgeCurrentPage === i + 1
                      ? "bg-primary-700 text-white"
                      : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setTicketFilter("ALL")}
              className={`px-3 py-1 rounded border ${
                ticketFilter === "ALL"
                  ? "bg-primary-700 text-white"
                  : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
              }`}
            >
              {t("filter.all")}
            </button>
            <button
              onClick={() => setTicketFilter("PENDING")}
              className={`px-3 py-1 rounded border ${
                ticketFilter === "PENDING"
                  ? "bg-yellow-500 text-white"
                  : "text-yellow-700 border-yellow-700 hover:bg-yellow-700 hover:text-white"
              }`}
            >
              {t("filter.pending")}
            </button>
            <button
              onClick={() => setTicketFilter("CONFIRMED")}
              className={`px-3 py-1 rounded border ${
                ticketFilter === "CONFIRMED"
                  ? "bg-green-600 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-700 hover:text-white"
              }`}
            >
              {t("filter.confirmed")}
            </button>
            <button
              onClick={() => setTicketFilter("CANCELLED")}
              className={`px-3 py-1 rounded border ${
                ticketFilter === "CANCELLED"
                  ? "bg-red-600 text-white"
                  : "text-red-700 border-red-700 hover:bg-red-700 hover:text-white"
              }`}
            >
              {t("filter.cancelled")}
            </button>
          </div>

          {!ticketState.loading && filteredTicketList.length === 0 && (
            <p className="text-gray-700">{t("emptyTicket")}</p>
          )}

          {!ticketState.loading && filteredTicketList.length > 0 && (
            <div className="space-y-4">
              {filteredTicketList.map((ticket) => (
                <TicketReservationCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={openTicketModal}
                />
              ))}
            </div>
          )}

          {ticketState.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: ticketState.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setTicketCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    ticketCurrentPage === i + 1
                      ? "bg-primary-700 text-white"
                      : "text-primary-800 border-primary-700 hover:bg-primary-700 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        <Link
          href="/profile"
          className="inline-block border border-primary-700 text-primary-800 px-4 py-2 rounded hover:bg-primary-700 hover:text-white"
        >
          {t("backToMain")}
        </Link>
      </div>

      {showingModal && pending && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
              <h2 className="text-lg font-semibold mb-4">{t("modal.title")}</h2>

              {pending.roomType?.images?.[0] && (
                <img
                  src={
                    typeof pending.roomType.images[0] === "string"
                      ? pending.roomType.images[0]
                      : pending.roomType.images[0]?.imageUrl
                  }
                  alt="Room Image"
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}

              <p className="mb-2">
                <strong>{t("modal.lodge")}:</strong>{" "}
                {pending.lodge?.id ? (
                  <Link
                    href={{
                      pathname: `/lodge/${pending.lodge.id}`,
                      query: {
                        roomTypeId: pending.roomType.id,
                        checkIn: formatDate(today),
                        checkOut: formatDate(tomorrow),
                        adults: 1,
                        children: 0,
                        roomCount: 1,
                      },
                    }}
                    className="text-primary-700 underline hover:text-primary-900"
                    onClick={() => setShowingModal(false)}
                  >
                    {pending.lodge?.name || "이름 없는 숙소"}
                  </Link>
                ) : (
                  pending.lodge?.name || "이름 없는 숙소"
                )}
              </p>

              <p className="mb-2">
                <strong>{t("modal.roomType")}:</strong>{" "}
                {pending.roomType?.name || "정보 없음"}
              </p>
              <p className="mb-2">
                <strong>{t("modal.checkIn")}:</strong>{" "}
                {pending.checkIn.slice(0, 10)}
              </p>
              <p className="mb-2">
                <strong>{t("modal.checkOut")}:</strong>{" "}
                {pending.checkOut.slice(0, 10)}
              </p>
              <p className="mb-2">
                <strong>{t("modal.adults")}:</strong>{" "}
                {t("modal.adultsWithCount", { count: pending.adults })}
              </p>
              <p className="mb-2">
                <strong>{t("modal.children")}:</strong>{" "}
                {t("modal.childrenWithCount", { count: pending.children })}
              </p>
              <p className="mb-2">
                <strong>{t("modal.roomCount")}:</strong>{" "}
                {t("modal.roomCountWithUnit", { count: pending.roomCount })}
              </p>
              <p className="mb-2">
                <strong>{t("modal.createdAt")}:</strong>{" "}
                {new Date(pending.createdAt).toLocaleString()}
              </p>
              <p className="mb-2">
                <strong>{t("modal.specialRequests")}:</strong>{" "}
                {parsedSpecialRequests(pending.specialRequests).length > 0
                  ? parsedSpecialRequests(pending.specialRequests).join(", ")
                  : t("modal.none")}
              </p>
              {pending && pending.status === "CONFIRMED" && (
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
                  onClick={() => setShowCancelModal(true)}
                >
                  {t("modal.cancel")}
                </button>
              )}
              <div className="mt-4">
                <button
                  className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
                  onClick={() => setShowingModal(false)}
                >
                  {t("modal.close")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {ticketModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-4">
              {t("ticketModal.title")}
            </h2>

            <p className="mb-2">
              <strong>{t("ticketModal.ticketName")}:</strong>{" "}
              {selectedTicket.ticketType?.name || t("modal.none")}
            </p>
            <p className="mb-2">
              <strong>{t("ticketModal.useDate")}:</strong>{" "}
              {formatKSTDate(selectedTicket.date)}
            </p>
            <p className="mb-2">
              <strong>{t("modal.adults")}:</strong>{" "}
              {t("modal.adultsWithCount", { count: pending.adults })}
            </p>
            <p className="mb-2">
              <strong>{t("modal.children")}:</strong>{" "}
              {t("modal.childrenWithCount", { count: pending.children })}
            </p>
            <p className="mb-2">
              <strong>{t("ticketModal.totalPrice")}:</strong>{" "}
              {selectedTicket.totalPrice?.toLocaleString() || "계산 안됨"}원
            </p>
            <p className="mb-2">
              <strong>{t("ticketModal.createdAt")}:</strong>{" "}
              {new Date(selectedTicket.createdAt).toLocaleString()}
            </p>
            {selectedTicket.status === "CONFIRMED" && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
                onClick={() => setShowTicketCancelModal(true)}
              >
                {t("ticketModal.cancel")}
              </button>
            )}

            <div className="mt-4 flex justify-end">
              <button
                className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
                onClick={() => setTicketModalOpen(false)}
              >
                {t("ticketModal.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{t("refund.title")}</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
              {t("refund.lodgingPolicy")}
            </p>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={agreeRefundPolicy}
                onChange={(e) => setAgreeRefundPolicy(e.target.checked)}
              />
              <span className="text-sm text-gray-800">
                {t("refund.agreeText")}
              </span>
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                {t("refund.close")}
              </button>
              <button
                disabled={!agreeRefundPolicy || isCancelling}
                onClick={handleReservationCancel}
                className={`px-4 py-2 rounded ${
                  agreeRefundPolicy
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isCancelling ? t("refund.cancelling") : t("refund.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTicketCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{t("refund.title")}</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
              {t("refund.ticketPolicy")}
            </p>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={agreeTicketRefundPolicy}
                onChange={(e) => setAgreeTicketRefundPolicy(e.target.checked)}
              />
              <span className="text-sm text-gray-800">
                {t("refund.agreeText")}
              </span>
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTicketCancelModal(false)}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                {t("refund.close")}
              </button>
              <button
                disabled={!agreeTicketRefundPolicy || isTicketCancelling}
                onClick={handleTicketCancel}
                className={`px-4 py-2 rounded ${
                  agreeTicketRefundPolicy
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isTicketCancelling
                  ? t("refund.cancelling")
                  : t("refund.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
