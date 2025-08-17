"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useLocale } from "@/utils/useLocale";

function getQnaArray(t: any, cat: string) {
  const raw = t(`faq.${cat}.qna`, { returnObjects: true });
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") return Object.values(raw);
  return [];
}

function FAQItem({
  id,
  question,
  answer,
  defaultOpen = false,
}: {
  id: string;
  question: string;
  answer: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between"
        aria-expanded={open}
        aria-controls={`faq-panel-${id}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <span
          className={`i-lucide-chevron-down h-5 w-5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>
      <div
        id={`faq-panel-${id}`}
        className="px-4 pt-0"
        style={{
          overflow: "hidden",
          transition: "max-height 220ms ease",
          maxHeight: open ? 400 : 0,
        }}
      >
        <div className="text-gray-700 leading-relaxed pt-2">{answer}</div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const { t } = useTranslation("help");
  const locale = useLocale();

  const categories = ["booking", "payment", "account", "policy", "technical"] as const;
  const [activeCat, setActiveCat] = useState<(typeof categories)[number]>("booking");
  const [query, setQuery] = useState("");

  const allFaqs = useMemo(() => {
    return categories.map((cat) => {
      const items = getQnaArray(t, cat);
      return { cat, items };
    });
  }, [t]);

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    const selected = allFaqs.find((c) => c.cat === activeCat)?.items ?? [];
    const list = Array.isArray(selected) ? selected : [];

    if (!lower) return list;

    return list.filter((it: any) => {
      const q = String(it?.q ?? "").toLowerCase();
      const a = String(it?.a ?? "").toLowerCase();
      return q.includes(lower) || a.includes(lower);
    });
  }, [query, activeCat, allFaqs]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("faq.title")}</h1>
        <p className="text-gray-600 mt-2">{t("faq.subtitle")}</p>
      </div>

      <div className="mb-4">
        <label htmlFor="faq-search" className="sr-only">
          {t("faq.searchLabel")}
        </label>
        <input
          id="faq-search"
          type="search"
          placeholder={t("faq.searchPlaceholder") as string}
          className="w-full border rounded-lg px-4 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition
              ${
                activeCat === cat
                  ? "bg-primary-700 text-white border-primary-700"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              }`}
            aria-pressed={activeCat === cat}
          >
            {t(`faq.${cat}.title`)}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500 mb-3">
        {t("faq.resultsCount", { count: Array.isArray(filtered) ? filtered.length : 0 })}
      </div>

      <div className="space-y-3">
        {Array.isArray(filtered) && filtered.length > 0 ? (
          filtered.map((item: any, idx: number) => (
            <FAQItem
              key={`${activeCat}-${idx}`}
              id={`${activeCat}-${idx}`}
              question={String(item?.q ?? "")}
              answer={
                <span>
                  {String(item?.a ?? "")}{" "}
                  {item?.linkToContact ? (
                    <>
                      {t("faq.a3.before")}{" "}
                      <Link href={`/${locale}/help/contact`} className="text-primary-700 underline">
                        {t("contact.title")}
                      </Link>
                      .
                    </>
                  ) : null}
                </span>
              }
              defaultOpen={idx === 0 && !query}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-600">
            {t("faq.empty")}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">{t("faq.feedback.question")}</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 text-sm rounded-full border border-gray-300 hover:bg-gray-50"
              onClick={() => console.log("FAQ helpful: yes")}
              aria-label={t("faq.feedback.yes")}
            >
              👍 {t("faq.feedback.yes")}
            </button>
            <button
              className="px-3 py-1.5 text-sm rounded-full border border-gray-300 hover:bg-gray-50"
              onClick={() => console.log("FAQ helpful: no")}
              aria-label={t("faq.feedback.no")}
            >
              👎 {t("faq.feedback.no")}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 bg-[#FAFAFA]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="font-medium text-gray-900">{t("faq.cta.title")}</div>
              <p className="text-gray-600 text-sm">{t("faq.cta.desc")}</p>
            </div>
            <Link
              href={`/${locale}/help/contact`}
              className="px-4 py-2 rounded-lg bg-primary-700 text-white hover:bg-primary-800 transition"
            >
              {t("faq.cta.button")}
            </Link>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: (Array.isArray(filtered) ? filtered : []).slice(0, 8).map((f: any) => ({
              "@type": "Question",
              name: String(f?.q ?? ""),
              acceptedAnswer: { "@type": "Answer", text: String(f?.a ?? "") }
            })),
          }),
        }}
      />
    </div>
  );
}
