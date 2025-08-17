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
        aria-hidden={!open}
        className={`px-4 transition-[max-height,padding,opacity] duration-200 ease-in-out ${
          open ? "py-4 opacity-100" : "py-0 opacity-0 pointer-events-none"
        }`}
        style={{ overflow: "hidden", maxHeight: open ? 400 : 0 }}
      >
        <div
          className={`text-gray-700 leading-relaxed ${open ? "pt-2" : "pt-0"}`}
        >
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const { t } = useTranslation("help");
  const locale = useLocale();

  const categories = [
    "booking",
    "payment",
    "account",
    "policy",
    "technical",
  ] as const;
  const [activeCat, setActiveCat] =
    useState<(typeof categories)[number]>("booking");

  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const allFaqs = useMemo(() => {
    return categories.map((cat) => ({
      cat,
      title: String(t(`faq.${cat}.title`)),
      items: getQnaArray(t, cat),
    }));
  }, [t]);

  const isSearching = searchTerm.trim().length > 0;

  const tabItems = useMemo(() => {
    const selected = allFaqs.find((c) => c.cat === activeCat)?.items ?? [];
    return Array.isArray(selected) ? selected : [];
  }, [allFaqs, activeCat]);

  const searchGroups = useMemo(() => {
    if (!isSearching) return [];
    const q = searchTerm.trim().toLowerCase();

    return allFaqs
      .map(({ cat, title, items }) => {
        const catTitle = String(title || "").toLowerCase();
        const filtered = (items || []).filter((it: any) => {
          const qq = String(it?.q ?? "").toLowerCase();
          const aa = String(it?.a ?? "").toLowerCase();
          return qq.includes(q) || aa.includes(q) || catTitle.includes(q);
        });
        return { cat, title, items: filtered };
      })
      .filter((g) => g.items.length > 0);
  }, [isSearching, searchTerm, allFaqs]);

  const resultsCount = isSearching
    ? searchGroups.reduce((sum, g) => sum + g.items.length, 0)
    : tabItems.length;

  const doSearch = () => setSearchTerm(input);
  const clearSearch = () => {
    setInput("");
    setSearchTerm("");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("faq.title")}</h1>
        <p className="text-gray-600 mt-2">{t("faq.subtitle")}</p>
      </div>

      <div className="mb-4 flex gap-2">
        <label htmlFor="faq-search" className="sr-only">
          {t("faq.searchLabel")}
        </label>
        <input
          id="faq-search"
          type="search"
          placeholder={t("faq.searchPlaceholder") as string}
          className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") doSearch();
          }}
        />
        <button
          onClick={doSearch}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-primary-50"
          aria-label={t("faq.searchLabel")}
        >
          Search{" "}
        </button>
        {isSearching && (
          <button
            onClick={clearSearch}
            className="px-3 py-2 rounded-lg text-white border-primary-500 bg-primary-500 hover:bg-primary-600"
          >
            Clear{" "}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => !isSearching && setActiveCat(cat)}
              className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition ${
                activeCat === cat && !isSearching
                  ? "bg-primary-700 text-white border-primary-700"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              } ${isSearching ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-pressed={activeCat === cat}
              aria-disabled={isSearching}
              title={
                isSearching
                  ? (t("faq.searchingAll", {
                      defaultValue: "Searching all categories",
                    }) as string)
                  : ""
              }
            >
              {t(`faq.${cat}.title`)}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          {t("faq.resultsCount", { count: resultsCount })}
        </div>
      </div>

      <div className="space-y-5">
        {isSearching ? (
          searchGroups.length > 0 ? (
            searchGroups.map((group) => (
              <div key={group.cat} className="space-y-3">
                <div className="text-sm font-medium text-gray-700">
                  {group.title}{" "}
                  <span className="text-gray-400">({group.items.length})</span>
                </div>
                <div className="space-y-3">
                  {group.items.map((item: any, idx: number) => (
                    <FAQItem
                      key={`${group.cat}-${idx}`}
                      id={`${group.cat}-${idx}`}
                      question={String(item?.q ?? "")}
                      answer={
                        <span>
                          {String(item?.a ?? "")}{" "}
                          {item?.linkToContact ? (
                            <>
                              {t("faq.a3.before")}{" "}
                              <Link
                                href={`/${locale}/help/contact`}
                                className="text-primary-700 underline"
                              >
                                {t("contact.title")}
                              </Link>
                              .
                            </>
                          ) : null}
                        </span>
                      }
                      defaultOpen={false}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-600">
              {t("faq.empty")}
            </div>
          )
        ) : (
          <div className="space-y-3">
            {tabItems.length > 0 ? (
              tabItems.map((item: any, idx: number) => (
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
                          <Link
                            href={`/${locale}/help/contact`}
                            className="text-primary-700 underline"
                          >
                            {t("contact.title")}
                          </Link>
                          .
                        </>
                      ) : null}
                    </span>
                  }
                  defaultOpen={idx === 0}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-600">
                {t("faq.empty")}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 p-4 bg-[#FAFAFA]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="font-medium text-gray-900">
              {t("faq.cta.title")}
            </div>
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
  );
}
