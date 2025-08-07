"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import { useGetNewsByIdQuery } from "@/lib/news/newsApi";
import { useParams, useRouter } from "next/navigation";
import HTMLViewer from "@/components/HTMLViewer";

const NewsDetailPage = () => {
  const { t } = useTranslation("news-detail");
  const locale = useLocale();
  const router = useRouter();
  const { id } = useParams();

  const { data: news, isLoading, isError } = useGetNewsByIdQuery(Number(id));

  return (
    <div className="container mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-primary-800 font-bold text-3xl">News</h1>
        <p
          onClick={() => router.push(`/${locale}/news/list`)}
          className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors duration-200 cursor-pointer"
        >
          <i className="bi bi-arrow-left mr-2"></i>
          {t("backToList")}
        </p>
      </div>
      <div className="border-b border-primary-800 mb-6"></div>

      {isLoading && <p className="text-gray-600">Loading...</p>}
      {isError && <p className="text-red-600">Error loading news</p>}
      {!isLoading && !isError && !news && (
        <p className="text-gray-600">{t("newsNotFound")}</p>
      )}

      {news && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-primary-900 mb-4">
            {news.title}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {new Date(news.createdAt).toLocaleDateString(locale)}
          </p>
          <div className="prose prose-primary max-w-none text-gray-800">
            <HTMLViewer html={news.content} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;