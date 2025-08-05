"use client";

import { fetchAllNews } from "@/lib/admin/news/newsThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const NewsAdminPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const newsList = useAppSelector((state) => state["admin/news"].list);
  const status = useAppSelector((state) => state["admin/news"].state);
  const error = useAppSelector((state) => state["admin/news"].error);

  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return newsList.slice(start, start + 10);
  }, [newsList, currentPage]);

  const totalPages = Math.ceil(newsList.length / 10);

  useEffect(() => {
    if (status === "idle" || status === "failed") {
      dispatch(fetchAllNews());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === "loading") {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [status, dispatch]);

  if (status === "failed") {
    return (
      <div className="p-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col py-8 px-24 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="cursor-pointer" onClick={() => router.back()}>
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

      {paginatedNews.length === 0 ? (
        <p className="text-gray-500">등록된 뉴스가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {paginatedNews.map((news) => (
            <li
              key={news.id}
              className="flex justify-between items-center border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-1">
                <p className="text-xl font-medium">{news.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(news.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    router.push(`/${locale}/admin/news/${news.id}`)
                  }
                  className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                  수정하기
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsAdminPage;
