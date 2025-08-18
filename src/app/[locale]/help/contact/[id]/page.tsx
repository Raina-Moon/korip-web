"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "@/utils/useLocale";
import { useAppSelector } from "@/lib/store/hooks";
import toast from "react-hot-toast";
import { useGetSupportByIdQuery } from "@/lib/support/supportApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Support } from "@/types/support";

export default function ContactDetailPage() {
  const { t } = useTranslation("contact");
  const router = useRouter();
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.auth.user);

  const idNum = Number(params.id);
  const redirected = useRef(false);
  const backUrl = `/${locale}/help/contact`;
  const loginUrl = `/${locale}/login?next=${encodeURIComponent(
    `/${locale}/help/contact/${params.id}`
  )}`;

  useEffect(() => {
    if (!user && !redirected.current) {
      redirected.current = true;
      toast.error(t("contact.loginRequired") as string);
      router.replace(loginUrl);
    }
  }, [user, router, loginUrl, t]);

  const { data, isLoading, isFetching, error } = useGetSupportByIdQuery(idNum, {
    skip: !user || Number.isNaN(idNum),
  });

  useEffect(() => {
    const e = error as FetchBaseQueryError | undefined;
    if (!e || redirected.current) return;
    if ("status" in (e ?? {}) && e?.status === 401) {
      redirected.current = true;
      toast.error(t("contact.loginRequired") as string);
      router.replace(loginUrl);
    }
  }, [error, router, loginUrl, t]);

  const contact = data as Support | undefined;
  const title = contact?.name || t("support.detailTitle");

  const answerForUser =
    contact?.originalLang === "EN"
      ? contact?.answerEn ?? contact?.answer ?? ""
      : contact?.answer ?? "";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <button
        onClick={() => router.push(backUrl)}
        className="text-sm text-gray-600 hover:underline mb-6"
      >
        ← {t("common.back")}
      </button>

      {isLoading || isFetching ? (
        <div className="text-gray-600">{t("loading")}</div>
      ) : !contact ? (
        <div className="text-gray-600">{t("support.notFound")}</div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold break-words">{title}</h1>
            <span
              className={
                "text-xs px-2 py-1 rounded border shrink-0 " +
                (contact.status === "ANSWERED"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200")
              }
            >
              {t(`support.status.${contact.status.toLowerCase()}`)}
            </span>
          </div>

          <section className="rounded-xl border p-4">
            <div className="text-sm font-semibold text-primary-700 mb-2">Q</div>
            <div className="prose whitespace-pre-wrap break-words">
              {contact.question}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {t("support.submittedAt")}:{" "}
              {new Date(contact.createdAt).toLocaleString()}
            </div>
          </section>

          <section className="rounded-xl border p-4">
            <div className="text-sm font-semibold text-gray-500 mb-2">A</div>
            {answerForUser ? (
              <>
                <div className="prose whitespace-pre-wrap break-words">
                  {answerForUser}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {t("support.answeredAt")}:{" "}
                  {contact.answeredAt
                    ? new Date(contact.answeredAt).toLocaleString()
                    : "-"}
                </div>
              </>
            ) : (
              <div className="text-gray-500">
                {t("support.waitingForAnswer")}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
