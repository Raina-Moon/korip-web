"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getReservationById } from "@/lib/admin/reservation/reservationThunk";

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between py-1 border-b border-gray-100">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

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
    return (
      <div className="p-10 text-center text-gray-500 text-lg">Loading...</div>
    );
  }

  if (state === "failed") {
    return (
      <div className="p-10 text-center text-red-500 text-lg">
        Error: {error ?? "Failed to load reservation"}
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="p-10 text-center text-gray-500">
        <p>Reservation not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        📋 예약 상세 (ID: {selected.id})
      </h1>

      <div className="bg-white shadow-lg rounded-xl divide-y divide-gray-200 overflow-hidden">
        {/* 예약자 정보 */}
        <section className="p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">
            👤 예약자 정보
          </h2>
          <div className="space-y-2">
            <Field label="이름" value={`${selected.lastName} ${selected.firstName}`} />
            <Field label="이메일" value={selected.email ?? "-"} />
            <Field label="전화번호" value={selected.phoneNumber} />
            {selected.user && (
              <Field
                label="회원 ID"
                value={`${selected.user.id} (${selected.user.nickname})`}
              />
            )}
          </div>
        </section>

        {/* 예약 정보 */}
        <section className="p-6 bg-gray-50">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">
            🏨 예약 정보
          </h2>
          <div className="space-y-2">
            <Field
              label="온천장"
              value={`${selected.lodge?.name} (${selected.lodge?.address})`}
            />
            <Field label="객실 타입" value={selected.roomType?.name} />
            <Field label="체크인" value={selected.checkIn.slice(0, 10)} />
            <Field label="체크아웃" value={selected.checkOut.slice(0, 10)} />
            <Field
              label="인원"
              value={`성인 ${selected.adults}명 / 어린이 ${selected.children}명`}
            />
            <Field label="방 개수" value={selected.roomCount} />
            <Field
              label="결제 금액"
              value={`${selected.totalPrice.toLocaleString()} 원`}
            />
            {selected.specialRequests && (
              <Field label="특별 요청" value={selected.specialRequests} />
            )}
          </div>
        </section>

        {/* 상태 정보 */}
        <section className="p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">
            ⚙️ 상태 정보
          </h2>
          <div className="space-y-2">
            <Field label="상태" value={selected.status} />
            {selected.cancelReason && (
              <Field label="취소 사유" value={selected.cancelReason} />
            )}
            <Field
              label="생성일"
              value={new Date(selected.createdAt).toLocaleString()}
            />
          </div>
        </section>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          ← 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default AdminReservationDetailPage;
