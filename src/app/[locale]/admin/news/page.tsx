"use client";

import { fetchAllNews } from "@/lib/admin/news/newsThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const NewsAdminPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const { list, page, limit, total, state, error } = useAppSelector(
    (state) => state["admin/news"]
  );

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    if (state === "idle" || state === "failed") {
      dispatch(fetchAllNews({ page: 1, limit: 10 }));
    }
  }, [dispatch, state]);

  useEffect(() => {
    if (state === "loading") dispatch(showLoading());
    else dispatch(hideLoading());
  }, [state, dispatch]);

  const handlePageChange = (p: number) => {
    dispatch(fetchAllNews({ page: p, limit }));
  };

  if (state === "failed") {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex justify-center flex-col py-8 px-24 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="cursor-pointer" onClick={() => router.push(`/${locale}/admin`)}>
          <ArrowLeft />
        </div>
        <h1 className="text-3xl font-bold">관리자 – 뉴스 목록</h1>
        <button
          onClick={() => router.push(`/${locale}/admin/news/create`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          뉴스 추가하기
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-gray-500">등록된 뉴스가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {list.map((news) => (
            <li
              key={news.id}
              className="flex justify-between items-center border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/${locale}/admin/news/${news.id}`)}
            >
              <div className="space-y-1">
                <p className="text-xl font-medium">{news.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(news.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-3 py-1 rounded ${
                page === idx + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsAdminPage;
