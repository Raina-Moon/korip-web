"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  updateUserRole,
  deleteUser,
  fetchUserReservations,
  fetchUserReviews,
} from "@/lib/admin/user/adminUserThunk";
import { AppDispatch, RootState } from "@/lib/store/store";

export default function UserDetailPage() {
  const [reservationPage, setReservationPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);

  const { userId } = useParams<{ userId: string }>();
  const dispatch: AppDispatch = useAppDispatch();
  const id = Number(userId);

  const { list, reservations, reviews, state } = useAppSelector(
    (state: RootState) => state["admin/user"]
  );

  const { reservationTotal, reservationLimit, reviewTotal, reviewLimit } =
    useAppSelector((state: RootState) => state["admin/user"]);

  const totalReservationPages = Math.ceil(reservationTotal / reservationLimit);
  const totalReviewPages = Math.ceil(reviewTotal / reviewLimit);

  const user = list.find((u) => u.id === id);

  useEffect(() => {
    if (user) {
      dispatch(
        fetchUserReservations({ userId: id, page: reservationPage, limit: 10 })
      );
      dispatch(fetchUserReviews({ userId: id, page: reviewPage, limit: 10 }));
    }
  }, [dispatch, id, user, reservationPage, reviewPage]);

  const handleRoleChange = (role: "USER" | "ADMIN") => {
    dispatch(updateUserRole({ userId: id, role }));
  };

  const handleDelete = () => {
    if (window.confirm("정말 이 사용자를 삭제하시겠습니까?")) {
      dispatch(deleteUser(id));
    }
  };

  if (!user) {
    return <div className="p-6">유저 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        사용자 상세 관리
      </h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
          기본 정보
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600">
              <strong>ID:</strong> {user.id}
            </p>
            <p className="text-gray-600">
              <strong>이메일:</strong> {user.email}
            </p>
            <p className="text-gray-600">
              <strong>닉네임:</strong> {user.nickname}
            </p>
            <p className="text-gray-600">
              <strong>가입일:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              권한 변경:
            </label>
            <select
              value={user.role}
              onChange={(e) =>
                handleRoleChange(e.target.value as "USER" | "ADMIN")
              }
              className="border rounded px-3 py-2 w-full"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          삭제
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
          예약 내역
        </h2>
        {state === "loading" && <p className="text-gray-500">불러오는 중...</p>}
        {reservations.length === 0 && (
          <p className="text-gray-500">예약이 없습니다.</p>
        )}
        {reservations.length > 0 && (
          <div className="space-y-4">
            {reservations.map((r) => (
              <div
                key={r.id}
                className="border rounded p-4 hover:shadow transition"
              >
                <p>
                  <strong>숙소:</strong> {r.lodge?.name ?? "알 수 없는 숙소"}
                </p>
                <p>
                  <strong>체크인:</strong>{" "}
                  {new Date(r.checkIn).toLocaleDateString()}
                </p>
                <p>
                  <strong>체크아웃:</strong>{" "}
                  {new Date(r.checkOut).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm">예약ID: {r.id}</p>
              </div>
            ))}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                disabled={reservationPage === 1}
                onClick={() => setReservationPage(reservationPage - 1)}
                className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                이전
              </button>
              <button
                disabled={reservationPage >= totalReservationPages}
                onClick={() => setReservationPage(reservationPage + 1)}
                className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
          작성 리뷰
        </h2>
        {state === "loading" && <p className="text-gray-500">불러오는 중...</p>}
        {reviews.length === 0 && (
          <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
        )}
        {reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded p-4 hover:shadow transition"
              >
                <p className="font-medium text-gray-800">
                  <strong>숙소:</strong>{" "}
                  {review.lodge?.name ?? "알 수 없는 숙소"}
                </p>
                <p>
                  <strong>평점:</strong> {review.rating} / 5
                </p>
                <p className="mt-2 text-gray-700">
                  <strong>리뷰 내용:</strong> {review.comment}
                </p>
              </div>
            ))}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                disabled={reviewPage === 1}
                onClick={() => setReviewPage(reviewPage - 1)}
                className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                이전
              </button>
              <button
                disabled={reviewPage >= totalReviewPages}
                onClick={() => setReviewPage(reviewPage + 1)}
                className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
