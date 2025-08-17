"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchAllSupports } from "@/lib/admin/support/supportThunk";
import { useRouter } from "next/navigation";

export default function AdminSupportListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { list, total, page, limit, state, error } = useAppSelector(
    (s: any) => s["admin/support"]
  );

  const [curPage, setCurPage] = useState<number>(page || 1);
  const [curLimit, setCurLimit] = useState<number>(limit || 20);

  useEffect(() => {
    dispatch(fetchAllSupports({ page: curPage, limit: curLimit }));
  }, [dispatch, curPage, curLimit]);

  const totalPages = Math.max(1, Math.ceil(total / curLimit));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">문의 목록</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">페이지당</label>
          <select
            className="border rounded px-2 py-1"
            value={curLimit}
            onChange={(e) => {
              setCurLimit(Number(e.target.value));
              setCurPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-4 py-2 w-20">ID</th>
              <th className="px-4 py-2">제목</th>
              <th className="px-4 py-2">상태</th>
              <th className="px-4 py-2">생성일</th>
              <th className="px-4 py-2">답변일</th>
            </tr>
          </thead>
          <tbody>
            {state === "loading" && (
              <tr>
                <td className="px-4 py-6 text-center" colSpan={5}>
                  로딩 중...
                </td>
              </tr>
            )}
            {state === "failed" && (
              <tr>
                <td className="px-4 py-6 text-center text-red-600" colSpan={5}>
                  {error ?? "불러오기에 실패했습니다."}
                </td>
              </tr>
            )}
            {state !== "loading" && list.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-600" colSpan={5}>
                  등록된 문의가 없습니다.
                </td>
              </tr>
            )}
            {list.map((it: any) => (
              <tr
                key={it.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/admin/support/${it.id}`)}
              >
                <td className="px-4 py-2">{it.id}</td>
                <td className="px-4 py-2">
                  <div className="font-medium line-clamp-1">
                    {it.title ?? it.name ?? "(제목 없음)"}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-1">
                    {it.question}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      "text-xs px-2 py-1 rounded border " +
                      (it.status === "ANSWERED"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200")
                    }
                  >
                    {it.status === "ANSWERED" ? "답변 완료" : "답변 대기"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(it.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {it.answeredAt ? new Date(it.answeredAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          총 {total.toLocaleString()}건 • {curPage} / {totalPages}페이지
        </div>
        <div className="flex items-center gap-2">
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            onClick={() => setCurPage((p) => Math.max(1, p - 1))}
            disabled={curPage <= 1}
          >
            이전
          </button>
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            onClick={() => setCurPage((p) => Math.min(totalPages, p + 1))}
            disabled={curPage >= totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
