"use client";

import { fetchEvents } from "@/lib/admin/events/eventsThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EventListPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const { list, page, limit, total, state, error } = useAppSelector(
    (state) => state["admin/events"]
  );

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    dispatch(fetchEvents({ page, limit }));
  }, [dispatch, page, limit]);

  useEffect(() => {
    if (state === "loading") dispatch(showLoading());
    else dispatch(hideLoading());
  }, [state, dispatch]);

  const handlePageChange = (pageNum: number) => {
    dispatch(fetchEvents({ page: pageNum, limit }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-2xl font-bold">이벤트 목록</h1>
        <button
          onClick={() => router.push(`/${locale}/admin/events/create`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} /> 이벤트 추가
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-gray-500">등록된 이벤트가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {list.map((event) => (
            <li
              key={event.id}
              onClick={() => router.push(`/${locale}/admin/events/${event.id}`)}
              className="border p-4 rounded hover:shadow cursor-pointer"
            >
              <p className="text-lg font-medium">{event.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventListPage;