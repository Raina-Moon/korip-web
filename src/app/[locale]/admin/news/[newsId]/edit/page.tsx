"use client";

import {
  fetchNewsById,
  updateNewsThunk,
} from "@/lib/admin/news/newsThunk";
import { clearCurrentNews } from "@/lib/admin/news/newsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useLocale } from "@/utils/useLocale";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NewsEditPage = () => {
  const { newsId } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const news = useAppSelector((state) => state["admin/news"].current);
  const isLoading = useAppSelector((state) => state["admin/news"].state === "loading");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (typeof newsId === "string") {
      dispatch(fetchNewsById(Number(newsId)));
    }

    return () => {
      dispatch(clearCurrentNews());
    };
  }, [dispatch, newsId]);

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setContent(news.content);
    }
  }, [news]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (typeof newsId !== "string") return;

    const result = await dispatch(
      updateNewsThunk({
        id: Number(newsId),
        data: { title, content },
      })
    );

    if (updateNewsThunk.fulfilled.match(result)) {
      toast.success("뉴스가 수정되었습니다.");
      router.push(`/${locale}/admin/news/${newsId}`);
    } else {
      toast.error("수정에 실패했습니다.");
    }
  };

  if (!news) {
    return <div className="p-8">뉴스 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">뉴스 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
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

export default NewsEditPage;
