"use client";

import { createNewsThunk } from "@/lib/admin/news/newsThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useLocale } from "@/utils/useLocale";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const NewsCreatePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isLoading = useAppSelector(
    (state) => state["admin/news"].state === "loading"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const result = await dispatch(createNewsThunk({ title, content }));
    if (createNewsThunk.fulfilled.match(result)) {
      toast.success("뉴스가 등록되었습니다.");
      router.push(`/${locale}/admin/news`);
    } else {
      toast.error("등록에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">뉴스 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <SimpleEditor onChange={setContent} />
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

export default NewsCreatePage;
