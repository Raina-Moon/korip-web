"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useLocale } from "@/utils/useLocale";
import { useAppSelector } from "@/lib/store/hooks";
import toast from "react-hot-toast";
import {
  useGetMySupportsQuery,
  useCreateSupportMutation,
} from "@/lib/support/supportApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type SupportItem = {
  id: number;
  question: string;
  answer?: string | null;
  status: "PENDING" | "ANSWERED";
  createdAt: string;
  updatedAt: string;
  answeredAt?: string | null;
};

const ContactListPage = () => {
  const { t } = useTranslation("contact");
  const router = useRouter();
  const locale = useLocale();
  const user = useAppSelector((s) => s.auth.user);

  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({ name: "", question: "" });

  const redirected = useRef(false);
  const loginUrl = `/${locale}/login?next=${encodeURIComponent(
    `/${locale}/help/support`
  )}`;

  useEffect(() => {
    if (!user && !redirected.current) {
      redirected.current = true;
      toast.error(t("contact.loginRequired") as string);
      router.replace(loginUrl);
    }
  }, [user, router, loginUrl, t]);

  const {
    data,
    isLoading,
    error,
  } = useGetMySupportsQuery(
    { page: 1, pageSize: 10 },
    { skip: !user }
  );

  useEffect(() => {
    const e = error as FetchBaseQueryError | undefined;
    if (!e || redirected.current) return;
    if ("status" in (e ?? {}) && e?.status === 401) {
      redirected.current = true;
      toast.error(t("contact.loginRequired") as string);
      router.replace(loginUrl);
    }
  }, [error, router, loginUrl, t]);

  const list = (data?.items ?? []) as SupportItem[];

  const [createSupport, { isLoading: creating }] = useCreateSupportMutation();

  const onSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const question = form.question.trim();
    if (!name || !question) {
      toast.error(t("contact.form.required") as string);
      return;
    }
    try {
      await createSupport({ name, question }).unwrap();
      toast.success(t("contact.successBody") as string);
      setOpenCreate(false);
      setForm({ name: "", question: "" });
    } catch (err) {
      const e = err as FetchBaseQueryError;
      if (e?.status === 401 && !redirected.current) {
        redirected.current = true;
        toast.error(t("contact.loginRequired") as string);
        router.replace(loginUrl);
      } else {
        toast.error("Failed");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("contact.title")}</h1>
        <button
          className="px-4 py-2 rounded-lg bg-primary-700 text-white hover:bg-primary-800 transition"
          onClick={() => setOpenCreate(true)}
        >
          {t("contact.createButton")}
        </button>
      </div>

      {isLoading ? (
        <div className="text-gray-600">{t("loading")}</div>
      ) : !user ? (
        <div className="text-gray-600">{t("contact.loginRequired")}</div>
      ) : list.length === 0 ? (
        <div className="text-gray-600">{t("support.empty")}</div>
      ) : (
        <ul className="divide-y rounded-lg border">
          {list.map((it) => (
            <li
              key={it.id}
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/${locale}/help/support/${it.id}`)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium line-clamp-1">{it.question}</div>
                <span
                  className={
                    "text-xs px-2 py-1 rounded border shrink-0 " +
                    (it.status === "ANSWERED"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200")
                  }
                >
                  {t(`support.status.${it.status.toLowerCase()}`)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(it.createdAt).toLocaleString()}
              </div>
              {it.answer ? (
                <div className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {t("support.answerPreview")} {it.answer}
                </div>
              ) : (
                <div className="text-sm text-gray-500 mt-2">
                  {t("support.waitingForAnswer")}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {openCreate && user && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t("contact.createTitle")}</h2>
              <button onClick={() => setOpenCreate(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <form onSubmit={onSubmitCreate} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder={t("contact.form.namePlaceholder") as string}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border rounded-lg px-4 py-2"
                required
                aria-label={t("contact.form.nameLabel")}
              />
              <textarea
                name="question"
                placeholder={t("support.form.questionPlaceholder") as string}
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                rows={6}
                className="w-full border rounded-lg px-4 py-2"
                required
                aria-label={t("support.form.questionLabel")}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-primary-700 text-white py-2 rounded-lg hover:bg-primary-800 transition disabled:opacity-60"
                >
                  {t("contact.form.submit")}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactListPage;
