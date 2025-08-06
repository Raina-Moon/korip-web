"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { deleteEventThunk, fetchEventById } from "@/lib/admin/events/eventsThunk";
import { clearCurrentEvent } from "@/lib/admin/events/eventsSlice";
import { useLocale } from "@/utils/useLocale";
import HTMLViewer from "@/components/HTMLViewer";

const EventDetailPage = () => {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const event = useAppSelector((state) => state["admin/events"].current);
  const isLoading = useAppSelector((state) => state["admin/events"].state === "loading");

  useEffect(() => {
    if (typeof eventId === "string") {
      dispatch(fetchEventById(Number(eventId)));
    }
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, eventId]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const result = await dispatch(deleteEventThunk(Number(eventId)));
    if (deleteEventThunk.fulfilled.match(result)) {
      toast.success("삭제되었습니다.");
      router.push(`/${locale}/admin/events`);
    } else {
      toast.error("삭제에 실패했습니다.");
    }
  };

  if (!event) return <p className="p-8">이벤트를 불러오는 중입니다...</p>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/${locale}/admin/events/${event.id}/edit`)}
            className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="border border-red-600 text-red-600 px-3 py-1 rounded hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        작성일: {new Date(event.createdAt).toLocaleString()}
      </p>
      <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
        <HTMLViewer html={event.content} />
      </div>
    </div>
  );
};

export default EventDetailPage;