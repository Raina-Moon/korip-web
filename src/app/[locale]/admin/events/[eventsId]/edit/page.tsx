"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchEventById,
  updateEventThunk,
} from "@/lib/admin/events/eventsThunk";
import { clearCurrentEvent } from "@/lib/admin/events/eventsSlice";
import { useLocale } from "@/utils/useLocale";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const EventEditPage = () => {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const event = useAppSelector((state) => state["admin/events"].current);
  const isLoading = useAppSelector(
    (state) => state["admin/events"].state === "loading"
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (typeof eventId === "string") {
      dispatch(fetchEventById(Number(eventId)));
    }
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, eventId]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setContent(event.content);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || typeof eventId !== "string") {
      toast.error("입력값을 확인해주세요.");
      return;
    }
    const result = await dispatch(
      updateEventThunk({ id: Number(eventId), data: { title, content } })
    );
    if (updateEventThunk.fulfilled.match(result)) {
      toast.success("수정되었습니다.");
      router.push(`/${locale}/admin/events/${eventId}`);
    } else {
      toast.error("수정에 실패했습니다.");
    }
  };

  if (!event) return <p className="p-8">이벤트 불러오는 중...</p>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">이벤트 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <SimpleEditor content={content} onChange={setContent} />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          수정하기
        </button>
      </form>
    </div>
  );
};

export default EventEditPage;
