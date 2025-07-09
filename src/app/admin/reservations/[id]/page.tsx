"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getReservationById } from "@/lib/admin/reservation/reservationThunk";

const AdminReservationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { selected, state, error } = useAppSelector(
    (state) => state.adminReservation
  );

  useEffect(() => {
    if (id) {
      dispatch(getReservationById(Number(id)));
    }
  }, [dispatch, id]);

  if (state === "loading" || state === "idle") {
    return <div className="p-6">Loading...</div>;
  }

  if (state === "failed") {
    return (
      <div className="p-6 text-red-500">
        Error: {error ?? "Failed to load reservation"}
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="p-6">
        <p>Reservation not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        예약 상세 (ID: {selected.id})
      </h1>

      <div className="space-y-2">
        <div>
          <strong>예약자명:</strong> {selected.lastName} {selected.firstName}
        </div>
        <div>
          <strong>이메일:</strong> {selected.email ?? "-"}
        </div>
        <div>
          <strong>전화번호:</strong> {selected.phoneNumber}
        </div>
        <div>
          <strong>온천장:</strong> {selected.lodge?.name}
        </div>
        <div>
          <strong>객실 타입:</strong> {selected.roomType?.name}
        </div>
        <div>
          <strong>체크인:</strong> {selected.checkIn.slice(0, 10)}
        </div>
        <div>
          <strong>체크아웃:</strong> {selected.checkOut.slice(0, 10)}
        </div>
        <div>
          <strong>상태:</strong> {selected.status}
        </div>
        <div>
          <strong>예약 개수:</strong> {selected.roomCount}
        </div>
        {selected.cancelReason && (
          <div>
            <strong>취소 사유:</strong> {selected.cancelReason}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservationDetailPage;
