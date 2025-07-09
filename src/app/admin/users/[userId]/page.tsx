"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  updateUserRole,
  deleteUser,
  fetchUserReservations,
  fetchUserReviews,
} from "@/lib/admin/user/adminUserThunk";
import { AppDispatch, RootState } from "@/lib/store/store";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const dispatch: AppDispatch = useAppDispatch();
  const id = Number(userId);

  const { list, reservations, reviews, state } = useAppSelector(
    (state: RootState) => state["admin/user"]
  );

  const user = list.find((u) => u.id === id);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserReservations(id));
      dispatch(fetchUserReviews(id));
    }
  }, [dispatch, id, user]);

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">사용자 상세 관리</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">기본 정보</h2>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>이메일:</strong> {user.email}
        </p>
        <p>
          <strong>닉네임:</strong> {user.nickname}
        </p>
        <p>
          <strong>가입일:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-2">
          <label className="mr-2">권한 변경:</label>
          <select
            value={user.role}
            onChange={(e) =>
              handleRoleChange(e.target.value as "USER" | "ADMIN")
            }
            className="border rounded px-2 py-1"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button
          onClick={handleDelete}
          className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">예약 내역</h2>
        {state === "loading" && <p>불러오는 중...</p>}
        {reservations.length === 0 && (
          <p className="text-gray-500">예약이 없습니다.</p>
        )}
        {reservations.length > 0 && (
          <ul className="list-disc pl-6">
            {reservations.map((r) => (
              <li key={r.id}>
                {r.lodge?.name ?? "알 수 없는 숙소"} -{" "}
                {new Date(r.checkIn).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">작성 리뷰</h2>
        {state === "loading" && <p>불러오는 중...</p>}
        {reviews.length === 0 && (
          <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
        )}
        {reviews.length > 0 && (
          <ul className="list-disc pl-6">
            {reviews.map((review) => (
              <li key={review.id}>
                <p>
                  <strong>{review.rating} / 5</strong>
                  <strong>리뷰 내용:</strong> {review.comment}
                </p>
                <p>
                  <strong>숙소 이름:</strong>{" "}
                  {review.lodge?.name ?? "알 수 없는 숙소"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
