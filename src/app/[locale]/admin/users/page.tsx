"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchAllUsers } from "@/lib/admin/user/adminUserThunk";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { useLocale } from "@/utils/useLocale";

export default function AdminUsersPage() {
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();

  const locale = useLocale();

  const { list, state, error, total, page, limit } = useAppSelector(
    (state: RootState) => state["admin/user"]
  );

  useEffect(() => {
    dispatch(fetchAllUsers({ page, limit }));
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    if (newPage > Math.ceil(total / limit)) return;
    dispatch(fetchAllUsers({ page: newPage, limit }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">관리자 - 사용자 관리</h1>

      {state === "failed" && <div className="text-red-500">Error: {error}</div>}

      {state === "succeeded" && Array.isArray(list) && list.length === 0 && (
        <div className="text-gray-500">No users found.</div>
      )}

      {state === "succeeded" && Array.isArray(list) && list.length > 0 && (
        <>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">이메일</th>
              <th className="p-2 border">닉네임</th>
              <th className="p-2 border">권한</th>
              <th className="p-2 border">가입일</th>
            </tr>
          </thead>
          <tbody>
            {list.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/${locale}/admin/users/${user.id}`)}
              >
                <td className="p-2 border text-center">{user.id}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.nickname}</td>
                <td className="p-2 border text-center">{user.role}</td>
                <td className="p-2 border text-center">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-4 gap-5">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className={`px-4 py-2 rounded ${
                page <= 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              이전
            </button>
            <span className="text-gray-700">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page * limit >= total}
              className={`px-4 py-2 rounded ${
                page * limit >= total
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}
