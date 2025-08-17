"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { patchSupport } from "@/lib/admin/support/supportThunk";
import { useLocale } from "@/utils/useLocale";

export default function AdminSupportDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const { list, state } = useAppSelector((s: any) => s["admin/support"]);
  const itemFromList = useMemo(
    () => list.find((x: any) => x.id === id),
    [list, id]
  );

  const [answer, setAnswer] = useState<string>(itemFromList?.answer ?? "");
  const [status, setStatus] = useState<"PENDING" | "ANSWERED">(
    itemFromList?.status ?? "PENDING"
  );

  useEffect(() => {
    if (itemFromList) {
      setAnswer(itemFromList.answer ?? "");
      setStatus(itemFromList.status);
    }
  }, [itemFromList]);

  const title = (itemFromList as any)?.title ?? (itemFromList as any)?.name ?? "(제목 없음)";

  const onSave = async () => {
    try {
      await dispatch(
        patchSupport({
          id,
          answer,
          status,
        })
      ).unwrap();
      alert("저장되었습니다.");
      router.push(`${locale}/admin/support`);
    } catch {
      alert("저장에 실패했습니다.");
    }
  };

  if (Number.isNaN(id)) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-red-600">
        잘못된 ID 입니다.
      </div>
    );
  }

  if (!itemFromList && state === "loading") {
    return (
      <div className="max-w-3xl mx-auto p-6 text-gray-600">로딩 중...</div>
    );
  }

  if (!itemFromList && state !== "loading") {
    return (
      <div className="max-w-3xl mx-auto p-6 text-gray-600">
        현재 상태에서 해당 문의를 찾을 수 없습니다. 목록에서 다시 시도해 주세요.
        <div className="mt-4">
          <button
            className="border rounded px-3 py-1"
            onClick={() => router.push(`${locale}/admin/support`)}
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  const it = itemFromList!;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        className="text-sm text-gray-600 hover:underline mb-4"
        onClick={() => router.push(`${locale}/admin/support`)}
      >
        ← 목록으로
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold break-words">{title}</h1>
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
      </div>

      <section className="rounded-xl border p-4 mb-6">
        <div className="text-sm font-semibold text-gray-500 mb-2">Q</div>
        <div className="prose whitespace-pre-wrap break-words">
          {it.question}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          제출 일시: {new Date(it.createdAt).toLocaleString()}
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <div className="text-sm font-semibold text-gray-500 mb-2">A</div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={8}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="답변 내용을 입력하세요..."
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">상태</label>
            <select
              className="border rounded px-2 py-1"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "PENDING" | "ANSWERED")
              }
            >
              <option value="PENDING">답변 대기</option>
              <option value="ANSWERED">답변 완료</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="border rounded px-4 py-2 hover:bg-gray-50"
              onClick={() => router.push("/admin/support")}
            >
              취소
            </button>
            <button
              className="bg-primary-700 text-white rounded px-4 py-2 hover:bg-primary-800"
              onClick={onSave}
            >
              저장
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-3">
          답변 일시: {it.answeredAt ? new Date(it.answeredAt).toLocaleString() : "-"}
        </div>
      </section>
    </div>
  );
}
