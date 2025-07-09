"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getReservationById } from "@/lib/admin/reservation/reservationThunk";

const AdminReservationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        예약 상세 (ID: {selected.id})
      </h1>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <section className="p-4">
          <h2 className="text-xl font-semibold mb-2">예약자 정보</h2>
          <div className="space-y-1 text-gray-700">
            <p><strong>이름:</strong> {selected.lastName} {selected.firstName}</p>
            <p><strong>이메일:</strong> {selected.email ?? "-"}</p>
            <p><strong>전화번호:</strong> {selected.phoneNumber}</p>
            {selected.user && (
              <p>
                <strong>회원 ID:</strong> {selected.user.id} ({selected.user.nickname})
              </p>
            )}
          </div>
        </section>

        <section className="p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">예약 정보</h2>
          <div className="space-y-1 text-gray-700">
            <p><strong>온천장:</strong> {selected.lodge?.name} ({selected.lodge?.address})</p>
            <p><strong>객실 타입:</strong> {selected.roomType?.name}</p>
            <p><strong>체크인:</strong> {selected.checkIn.slice(0,10)}</p>
            <p><strong>체크아웃:</strong> {selected.checkOut.slice(0,10)}</p>
            <p><strong>성인:</strong> {selected.adults}명 / <strong>어린이:</strong> {selected.children}명</p>
            <p><strong>방 개수:</strong> {selected.roomCount}</p>
          </div>
        </section>

        <section className="p-4">
          <h2 className="text-xl font-semibold mb-2">상태 정보</h2>
          <div className="space-y-1 text-gray-700">
            <p><strong>상태:</strong> {selected.status}</p>
            {selected.cancelReason && (
              <p><strong>취소 사유:</strong> {selected.cancelReason}</p>
            )}
            <p><strong>생성일:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
          </div>
        </section>
      </div>

      <div className="mt-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default AdminReservationDetailPage;
