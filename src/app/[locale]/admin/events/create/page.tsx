"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createEventThunk } from "@/lib/admin/events/eventsThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useLocale } from "@/utils/useLocale";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";


const EventCreatePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const isLoading = useAppSelector((state) => state["admin/events"].state === "loading");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }
    const result = await dispatch(createEventThunk({ title, content }));
    if (createEventThunk.fulfilled.match(result)) {
      toast.success("이벤트가 등록되었습니다.");
      router.push(`/${locale}/admin/events`);
    } else {
      toast.error("등록에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">이벤트 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <SimpleEditor />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          등록하기
        </button>
      </form>
    </div>
  );
};

export default EventCreatePage;