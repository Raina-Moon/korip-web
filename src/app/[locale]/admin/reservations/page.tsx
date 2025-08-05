"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  getAllReservations,
  updateReservationStatus,
} from "@/lib/admin/reservation/reservationThunk";
import { useRouter } from "next/navigation";
import {
  getAllTicketReservations,
  updateTicketReservationStatus,
} from "@/lib/admin/reservation/ticketReservationThunk";
import { useLocale } from "@/utils/useLocale";

const AdminReservationsPage = () => {
  const [filter, setFilter] = useState<"all" | "lodges" | "tickets">("all");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const locale = useLocale();

  const lodge = useAppSelector((state) => state.adminReservation);
  const ticket = useAppSelector((state) => state.adminTicketReservation);

  const limit = 10;

  useEffect(() => {
    if (filter === "lodges" || filter === "all") {
      dispatch(getAllReservations({ page: lodge.page, limit }));
    }
    if (filter === "tickets" || filter === "all") {
      dispatch(getAllTicketReservations({ page: ticket.page, limit }));
    }
  }, [dispatch, filter, lodge.page, ticket.page]);

  const combinedList =
    filter === "all"
      ? [
          ...lodge.list.map((item) => ({ ...item, type: "lodges" as const })),
          ...ticket.list.map((item) => ({ ...item, type: "tickets" as const })),
        ]
      : filter === "lodges"
      ? lodge.list.map((item) => ({ ...item, type: "lodges" as const }))
      : ticket.list.map((item) => ({ ...item, type: "tickets" as const }));

  const handleUpdateStatus = (
    id: number,
    type: "lodges" | "tickets",
    newStatus: string,
    cancelReason?: string
  ) => {
    if (type === "lodges") {
      dispatch(updateReservationStatus({ id, status: newStatus, cancelReason }))
        .unwrap()
        .then(() => {
          dispatch(getAllReservations({ page: lodge.page, limit }));
        })
        .catch(console.error);
    } else {
      dispatch(
        updateTicketReservationStatus({ id, status: newStatus, cancelReason })
      )
        .unwrap()
        .then(() => {
          dispatch(getAllTicketReservations({ page: ticket.page, limit }));
        })
        .catch(console.error);
    }
  };

  const loading = lodge.state === "loading" || ticket.state === "loading";
  const error = lodge.error || ticket.error;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">숙박/티켓 예약 관리</h1>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter("lodges")}
          className={`px-4 py-2 rounded ${
            filter === "lodges" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          숙박
        </button>
        <button
          onClick={() => setFilter("tickets")}
          className={`px-4 py-2 rounded ${
            filter === "tickets" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          티켓
        </button>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}

      {loading && <p>Loading...</p>}

      {!loading && combinedList.length === 0 && <p>No reservations found.</p>}

      {!loading && combinedList.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">예약번호</th>
                  <th className="px-4 py-2 border">예약자명</th>
                  <th className="px-4 py-2 border">이메일</th>
                  <th className="px-4 py-2 border">전화번호</th>
                  <th className="px-4 py-2 border">종류</th>
                  <th className="px-4 py-2 border">타입</th>
                  <th className="px-4 py-2 border">체크인/사용일</th>
                  <th className="px-4 py-2 border">체크아웃</th>
                  <th className="px-4 py-2 border">상태</th>
                  <th className="px-4 py-2 border">관리</th>
                </tr>
              </thead>
              <tbody>
                {combinedList.map((item) => (
                  <tr
                    key={`${item.type}-${item.id}`}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      if (item.type === "lodges") {
                        router.push(`/${locale}/admin/reservations/${item.id}`);
                      } else {
                        router.push(`/${locale}/admin/reservations/ticket/${item.id}`);
                      }
                    }}
                  >
                    <td className="px-4 py-2 border">{item.id}</td>
                    <td className="px-4 py-2 border">
                      {item.lastName} {item.firstName}
                    </td>
                    <td className="px-4 py-2 border">{item.email ?? "-"}</td>
                    <td className="px-4 py-2 border">{item.phoneNumber}</td>
                    <td className="px-4 py-2 border">
                      {item.type === "lodges" ? "숙박" : "티켓"}
                    </td>
                    <td className="px-4 py-2 border">
                      {item.type === "lodges"
                        ? item.roomType?.name
                        : item.ticketType?.name}
                    </td>
                    <td className="px-4 py-2 border">
                      {item.type === "lodges"
                        ? item.checkIn?.slice(0, 10)
                        : item.date?.slice(0, 10)}
                    </td>
                    <td className="px-4 py-2 border">
                      {item.type === "lodges"
                        ? item.checkOut?.slice(0, 10)
                        : "-"}
                    </td>
                    <td className="px-4 py-2 border">{item.status}</td>
                    <td className="px-4 py-2 border space-x-2">
                      {item.status !== "CONFIRMED" && (
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(item.id, item.type, "CONFIRMED");
                          }}
                        >
                          승인
                        </button>
                      )}
                      {item.status !== "CANCELLED" && (
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(
                              item.id,
                              item.type,
                              "CANCELLED",
                              "ADMIN_FORCED"
                            );
                          }}
                        >
                          취소
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filter !== "all" && (
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                disabled={
                  filter === "lodges" ? lodge.page <= 1 : ticket.page <= 1
                }
                onClick={() =>
                  filter === "lodges"
                    ? dispatch(
                        getAllReservations({ page: lodge.page - 1, limit })
                      )
                    : dispatch(
                        getAllTicketReservations({
                          page: ticket.page - 1,
                          limit,
                        })
                      )
                }
              >
                이전
              </button>

              <span>
                Page {filter === "lodges" ? lodge.page : ticket.page} /{" "}
                {filter === "lodges"
                  ? Math.ceil(lodge.total / limit)
                  : Math.ceil(ticket.total / limit)}{" "}
                ({filter === "lodges" ? lodge.total : ticket.total} items)
              </span>

              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                disabled={
                  filter === "lodges"
                    ? lodge.page >= Math.ceil(lodge.total / limit)
                    : ticket.page >= Math.ceil(ticket.total / limit)
                }
                onClick={() =>
                  filter === "lodges"
                    ? dispatch(
                        getAllReservations({ page: lodge.page + 1, limit })
                      )
                    : dispatch(
                        getAllTicketReservations({
                          page: ticket.page + 1,
                          limit,
                        })
                      )
                }
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminReservationsPage;
