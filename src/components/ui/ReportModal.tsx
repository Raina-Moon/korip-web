"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface ReportModalProps {
  isOpen: boolean;
  reason: string;
  setReason: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  selectedReviewId?: number | null;
}

export default function ReportModal({
  isOpen,
  reason,
  setReason,
  onClose,
  onSubmit,
}: ReportModalProps) {
  const { t } = useTranslation("report");
  const panelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const id = setTimeout(() => textareaRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(id);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 sm:px-6 py-4"
      onClick={handleBackdropClick}
      aria-labelledby="report-modal-title"
      aria-describedby="report-modal-desc"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl
                   p-4 sm:p-6 gap-4 sm:gap-5 flex flex-col
                   max-h-[85vh] overflow-y-auto"
      >
        <h2
          id="report-modal-title"
          className="text-base sm:text-lg font-semibold text-primary-900"
        >
          {t("title")}
        </h2>
        <p id="report-modal-desc" className="text-xs sm:text-sm text-gray-600">
          {t("description")}
        </p>

        <div className="flex flex-col gap-2">
          <label htmlFor="report-reason" className="sr-only">
            {t("placeholder")}
          </label>
          <textarea
            id="report-reason"
            ref={textareaRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border rounded-lg px-3 py-2 w-full text-sm sm:text-base
                       min-h-[120px] sm:min-h-[160px]
                       focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder={t("placeholder") as string}
          />
          <p className="text-[11px] sm:text-xs text-gray-400">{t("submit")}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border rounded-lg text-sm sm:text-base
                       hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onSubmit}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm sm:text-base
                       bg-red-600 text-white hover:bg-red-700
                       focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
            disabled={!reason.trim()}
          >
            {t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
