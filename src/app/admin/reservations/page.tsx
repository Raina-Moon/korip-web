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
  const { list, state, error } = useAppSelector(
    (state) => state.adminReservation
  );

  useEffect(() => {
    dispatch(getAllReservations());
  }, [dispatch]);

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
        dispatch(getAllReservations());
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
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Lodge</th>
                <th className="px-4 py-2 border">Room Type</th>
                <th className="px-4 py-2 border">Check-In</th>
                <th className="px-4 py-2 border">Check-Out</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((reservation: Reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{reservation.id}</td>
                  <td className="px-4 py-2 border">
                    {reservation.user?.nickname} ({reservation.user?.email})
                  </td>
                  <td className="px-4 py-2 border">{reservation.lodgeId}</td>
                  <td className="px-4 py-2 border">{reservation.roomTypeId}</td>
                  <td className="px-4 py-2 border">
                    {reservation.firstName} {reservation.lastName}
                  </td>
                  <td className="px-4 py-2 border">
                    {reservation.phoneNumber}
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
                        Confirm
                      </button>
                    )}
                    {reservation.status !== "CANCELLED" && (
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() =>
                          handleUpdateStatus(
                            reservation.id,
                            "CANCELED",
                            "ADMIN_FORCED"
                          )
                        }
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {state === "idle" && <p>Loading...</p>}
    </div>
  );
};

export default AdminReservationsPage;
