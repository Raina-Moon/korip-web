"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  getAllReservations,
  updateReservationStatus,
} from "@/lib/admin/reservation/reservationThunk";
import { Reservation } from "@/types/reservation";

const AdminReservationsPage = () => {
  const dispatch = useAppDispatch();
  const { list, state, error, page, total, limit } = useAppSelector(
    (state) => state.adminReservation
  );

  useEffect(() => {
    dispatch(getAllReservations({ page: 1, limit }));
  }, [dispatch, limit]);

  const handleUpdateStatus = (
    id: number,
    newStatus: string,
    cancelReason?: string
  ) => {
    dispatch(
      updateReservationStatus({
        id,
        status: newStatus === "CANCELED" ? "CANCELLED" : newStatus,
        cancelReason,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getAllReservations({ page, limit }));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Reservation Management</h1>

      {state === "failed" && <p className="text-red-500">Error: {error}</p>}

      {state === "succeeded" && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">예약번호</th>
                  <th className="px-4 py-2 border">예약자명</th>
                  <th className="px-4 py-2 border">이메일</th>
                  <th className="px-4 py-2 border">전화번호</th>
                  <th className="px-4 py-2 border">온천장</th>
                  <th className="px-4 py-2 border">객실타입</th>
                  <th className="px-4 py-2 border">체크인</th>
                  <th className="px-4 py-2 border">체크아웃</th>
                  <th className="px-4 py-2 border">상태</th>
                  <th className="px-4 py-2 border">관리</th>
                </tr>
              </thead>

              <tbody>
                {list.map((reservation: Reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{reservation.id}</td>
                    <td className="px-4 py-2 border">
                      {reservation.lastName} {reservation.firstName}
                    </td>
                    <td className="px-4 py-2 border">
                      {reservation.email ?? "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {reservation.phoneNumber}
                    </td>
                    <td className="px-4 py-2 border">
                      {reservation.lodge?.name}
                    </td>
                    <td className="px-4 py-2 border">
                      {reservation.roomType?.name}
                    </td>
                    <td className="px-4 py-2 border">
                      {reservation.checkIn.slice(0, 10)}
                    </td>
                    <td className="px-4 py-2 border">
                      {reservation.checkOut.slice(0, 10)}
                    </td>
                    <td className="px-4 py-2 border">{reservation.status}</td>
                    <td className="px-4 py-2 border space-x-2">
                      {reservation.status !== "CONFIRMED" && (
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          onClick={() =>
                            handleUpdateStatus(reservation.id, "CONFIRMED")
                          }
                        >
                          승인
                        </button>
                      )}
                      {reservation.status !== "CANCELLED" && (
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() =>
                            handleUpdateStatus(
                              reservation.id,
                              "CANCELLED",
                              "ADMIN_FORCED"
                            )
                          }
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

          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              disabled={page <= 1}
              onClick={() =>
                dispatch(getAllReservations({ page: page - 1, limit }))
              }
            >
              이전
            </button>

            <span>
              Page {page} / {Math.ceil(total / limit)} ({total} items)
            </span>

            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              disabled={page >= Math.ceil(total / limit)}
              onClick={() =>
                dispatch(getAllReservations({ page: page + 1, limit }))
              }
            >
              다음
            </button>
          </div>
        </>
      )}

      {state === "idle" && <p>Loading...</p>}
    </div>
  );
};

export default AdminReservationsPage;
