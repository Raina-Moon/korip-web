"use client";

import React from "react";
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
  const {t} = useTranslation("report")
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full gap-5 flex flex-col">
        <h2 className="text-lg font-semibold text-primary-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("description")}</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border rounded p-2 w-full min-h-[100px]"
          placeholder={t("placeholder")}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
