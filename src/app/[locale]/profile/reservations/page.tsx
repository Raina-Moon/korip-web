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
import toast from "react-hot-toast";
import { Reservation } from "@/types/reservation";
import {
  getLocalizedReservationLodgeName,
  getLocalizedReservationRoomName,
} from "@/utils/getLocalizedReservField";
import { getLocalizedTicketTypeName } from "@/utils/getLocalizedTicketReservation";

export default function ReservationListPage() {
  const { t, i18n } = useTranslation("reservations");
  const [showingModal, setShowingModal] = useState(false);
  const [pending, setPending] = useState<Reservation | null>(null);
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

  const openModal = (reservation: Reservation) => {
    setShowingModal(true);
    setPending(reservation);
  };

  const parsedSpecialRequests = (input: unknown): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    try {
      const parsed = JSON.parse(input as string);
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
      toast.success(t("alert.cancelSuccess"));
    } catch {
      toast.error(t("alert.cancelFailed"));
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
      toast.success(t("alert.ticketCancelSuccess"));
    } catch {
      toast.error(t("alert.ticketCancelFailed"));
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center sm:text-left">
          {t("title")}
        </h1>

        <div
          role="tablist"
          aria-label={t("title")}
          className="mt-4 mb-6 flex justify-center sm:justify-start"
        >
          <div className="inline-flex w-full sm:w-auto rounded-xl overflow-hidden border border-primary-700">
            <button
              role="tab"
              aria-selected={typeFilter === "LODGING"}
              onClick={() => setTypeFilter("LODGING")}
              className={`w-1/2 sm:w-auto px-4 py-2 text-sm sm:text-base transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                typeFilter === "LODGING"
                  ? "bg-primary-700 text-white"
                  : "text-primary-800 hover:bg-primary-700/10"
              }`}
            >
              {t("lodgingTab")}
            </button>
            <button
              role="tab"
              aria-selected={typeFilter === "TICKET"}
              onClick={() => setTypeFilter("TICKET")}
              className={`w-1/2 sm:w-auto px-4 py-2 text-sm sm:text-base transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                typeFilter === "TICKET"
                  ? "bg-primary-700 text-white"
                  : "text-primary-800 hover:bg-primary-700/10"
              }`}
            >
              {t("ticketTab")}
            </button>
          </div>
        </div>

        {typeFilter === "LODGING" ? (
          <>
            {/* Lodging filters - mobile horizontal scroll pills */}
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible whitespace-nowrap pb-1">
                <button
                  onClick={() => setFilter("ALL")}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
                    filter === "ALL"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-primary-800 hover:bg-gray-200"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                >
                  {t("filter.all")}
                </button>
                <button
                  onClick={() => setFilter("PENDING")}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
                    filter === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-yellow-700 hover:bg-yellow-100"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500`}
                >
                  {t("filter.pending")}
                </button>
                <button
                  onClick={() => setFilter("CONFIRMED")}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
                    filter === "CONFIRMED"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-green-700 hover:bg-green-100"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500`}
                >
                  {t("filter.confirmed")}
                </button>
                <button
                  onClick={() => setFilter("CANCELLED")}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
                    filter === "CANCELLED"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-red-700 hover:bg-red-100"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500`}
                >
                  {t("filter.cancelled")}
                </button>
              </div>
            </div>

            {loading && (
              <p className="mt-4 text-gray-600 text-center">{t("loading")}</p>
            )}
            {error && (
              <p className="mt-4 text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                {error}
              </p>
            )}
            {!loading && !error && filteredList.length === 0 && (
              <p className="mt-4 text-gray-500 text-center">{t("empty")}</p>
            )}
            {!loading && !error && filteredList.length > 0 && (
              <div className="mt-4 space-y-4 sm:space-y-5">
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
              <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setLodgeCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                      lodgeCurrentPage === i + 1
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-primary-800 hover:bg-gray-200"
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Ticket filters - mobile horizontal scroll pills */}
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible whitespace-nowrap pb-1">
                <button
                  onClick={() => setTicketFilter("ALL")}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
                    ticketFilter === "ALL"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-primary-800 hover:bg-gray-200"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                >
                  {t("filter.all")}
                </button>
                <button
                  onClick={() => setTicketFilter("PENDING")}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
                    ticketFilter === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-yellow-700 hover:bg-yellow-100"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500`}
                >
                  {t("filter.pending")}
                </button>
                <button
                  onClick={() => setTicketFilter("CONFIRMED")}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
                    ticketFilter === "CONFIRMED"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-green-700 hover:bg-green-100"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500`}
                >
                  {t("filter.confirmed")}
                </button>
                <button
                  onClick={() => setTicketFilter("CANCELLED")}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition ${
                    ticketFilter === "CANCELLED"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-red-700 hover:bg-red-100"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500`}
                >
                  {t("filter.cancelled")}
                </button>
              </div>
            </div>

            {ticketState.loading && (
              <p className="mt-4 text-gray-600 text-center">{t("loading")}</p>
            )}
            {ticketState.error && (
              <p className="mt-4 text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                {ticketState.error}
              </p>
            )}
            {!ticketState.loading && filteredTicketList.length === 0 && (
              <p className="mt-4 text-gray-500 text-center">
                {t("emptyTicket")}
              </p>
            )}
            {!ticketState.loading && filteredTicketList.length > 0 && (
              <div className="mt-4 space-y-4 sm:space-y-5">
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
              <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
                {Array.from({ length: ticketState.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setTicketCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                      ticketCurrentPage === i + 1
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-primary-800 hover:bg-gray-200"
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/profile"
            className="px-6 py-3 rounded-lg bg-primary-600 text-white text-sm sm:text-base hover:bg-primary-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {t("backToMain")}
          </Link>
        </div>
      </div>

      {showingModal && pending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md sm:max-w-lg p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary-700">
              {t("modal.title")}
            </h2>

            {pending.roomType?.images?.[0] && (
              <img
                src={
                  typeof pending.roomType.images[0] === "string"
                    ? pending.roomType.images[0]
                    : pending.roomType.images[0]?.imageUrl
                }
                alt="Room Image"
                className="w-full h-44 sm:h-56 object-cover rounded-lg"
              />
            )}

            <div className="space-y-2 text-sm sm:text-base">
              <p className="text-gray-700">
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
                    className="text-primary-600 hover:text-primary-700 underline"
                    onClick={() => setShowingModal(false)}
                  >
                    {getLocalizedReservationLodgeName(pending, i18n.language) ||
                      "이름 없는 숙소"}
                  </Link>
                ) : (
                  getLocalizedReservationLodgeName(pending, i18n.language) ||
                  "정보 없음"
                )}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.roomType")}:</strong>{" "}
                {getLocalizedReservationRoomName(pending, i18n.language) ||
                  "이름 없는 객실"}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.checkIn")}:</strong>{" "}
                {pending.checkIn.slice(0, 10)}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.checkOut")}:</strong>{" "}
                {pending.checkOut.slice(0, 10)}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.adults")}:</strong>{" "}
                {t("modal.adultsWithCount", { count: pending.adults })}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.children")}:</strong>{" "}
                {t("modal.childrenWithCount", { count: pending.children })}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.roomCount")}:</strong>{" "}
                {t("modal.roomCountWithUnit", { count: pending.roomCount })}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.createdAt")}:</strong>{" "}
                {new Date(pending.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.specialRequests")}:</strong>{" "}
                {parsedSpecialRequests(pending.specialRequests).length > 0
                  ? parsedSpecialRequests(pending.specialRequests).join(", ")
                  : t("modal.none")}
              </p>
            </div>

            <div className="flex justify-end gap-2 sm:gap-3">
              {pending.status === "CONFIRMED" && (
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm sm:text-base hover:bg-red-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  onClick={() => setShowCancelModal(true)}
                >
                  {t("modal.cancel")}
                </button>
              )}
              <button
                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm sm:text-base hover:bg-primary-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                onClick={() => setShowingModal(false)}
              >
                {t("modal.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {ticketModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md sm:max-w-lg p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary-700">
              {t("ticketModal.title")}
            </h2>

            <div className="space-y-2 text-sm sm:text-base">
              <p className="text-gray-700">
                <strong>{t("ticketModal.ticketName")}:</strong>{" "}
                {getLocalizedTicketTypeName(selectedTicket, i18n.language) ||
                  t("modal.none")}
              </p>
              <p className="text-gray-700">
                <strong>{t("ticketModal.useDate")}:</strong>{" "}
                {formatKSTDate(selectedTicket.date)}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.adults")}:</strong>{" "}
                {t("modal.adultsWithCount", { count: selectedTicket.adults })}
              </p>
              <p className="text-gray-700">
                <strong>{t("modal.children")}:</strong>{" "}
                {t("modal.childrenWithCount", {
                  count: selectedTicket.children,
                })}
              </p>
              <p className="text-gray-700">
                <strong>{t("ticketModal.totalPrice")}:</strong>{" "}
                {(selectedTicket.totalPrice?.toLocaleString() ?? "") + "원"}
              </p>
              <p className="text-gray-700">
                <strong>{t("ticketModal.createdAt")}:</strong>{" "}
                {new Date(selectedTicket.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end gap-2 sm:gap-3">
              {selectedTicket.status === "CONFIRMED" && (
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm sm:text-base hover:bg-red-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  onClick={() => setShowTicketCancelModal(true)}
                >
                  {t("ticketModal.cancel")}
                </button>
              )}
              <button
                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm sm:text-base hover:bg-primary-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                onClick={() => setTicketModalOpen(false)}
              >
                {t("ticketModal.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md sm:max-w-lg p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary-700">
              {t("refund.title")}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
              {t("refund.lodgingPolicy")}
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreeRefundPolicy}
                onChange={(e) => setAgreeRefundPolicy(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm sm:text-base text-gray-700">
                {t("refund.agreeText")}
              </span>
            </label>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {t("refund.close")}
              </button>
              <button
                disabled={!agreeRefundPolicy || isCancelling}
                onClick={handleReservationCancel}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  agreeRefundPolicy && !isCancelling
                    ? "bg-red-600 hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md sm:max-w-lg p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary-700">
              {t("refund.title")}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
              {t("refund.ticketPolicy")}
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreeTicketRefundPolicy}
                onChange={(e) => setAgreeTicketRefundPolicy(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm sm:text-base text-gray-700">
                {t("refund.agreeText")}
              </span>
            </label>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowTicketCancelModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {t("refund.close")}
              </button>
              <button
                disabled={!agreeTicketRefundPolicy || isTicketCancelling}
                onClick={handleTicketCancel}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  agreeTicketRefundPolicy && !isTicketCancelling
                    ? "bg-red-600 hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
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
