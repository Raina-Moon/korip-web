"use client";

import {
  deleteNewsThunk,
  fetchNewsById,
} from "@/lib/admin/news/newsThunk";
import { clearCurrentNews } from "@/lib/admin/news/newsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import HTMLViewer from "@/components/HTMLViewer";

const NewsDetailPage = () => {
  const { newsId } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const news = useAppSelector((state) => state["admin/news"].current);
  const state = useAppSelector((state) => state["admin/news"].state);
  const error = useAppSelector((state) => state["admin/news"].error);

  useEffect(() => {
    if (typeof newsId === "string") {
      dispatch(fetchNewsById(Number(newsId)));
    }

    return () => {
      dispatch(clearCurrentNews());
    };
  }, [dispatch, newsId]);

  useEffect(() => {
    if (state === "loading") dispatch(showLoading());
    else dispatch(hideLoading());
  }, [state, dispatch]);

  const handleDelete = async () => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm || typeof newsId !== "string") return;

    const result = await dispatch(deleteNewsThunk(Number(newsId)));
    if (deleteNewsThunk.fulfilled.match(result)) {
      toast.success("뉴스가 삭제되었습니다.");
      router.push(`/${locale}/admin/news`);
    } else {
      toast.error("삭제에 실패했습니다.");
    }
  };

  if (!news) {
    return (
      <div className="p-8 text-gray-500">
        {state === "loading" ? "불러오는 중..." : "뉴스를 찾을 수 없습니다."}
        {state === "failed" && <p className="text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{news.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() =>
              router.push(`/${locale}/admin/news/${news.id}/edit`)
            }
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        작성일: {new Date(news.createdAt).toLocaleString()}
      </p>
      <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
        <HTMLViewer html={news.content} />
      </div>
    </div>
  );
};

export default NewsDetailPage;
