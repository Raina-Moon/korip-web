"use client";

import React, { useState } from "react";
import LodgeReview from "../../../../components/reviews/LodgeReview";
import TicketReview from "../../../../components/reviews/TicketReview";
import { useTranslation } from "react-i18next";

const ReviewsPage = () => {
  const { t } = useTranslation("reviews");
  const [selectedTab, setSelectedTab] = useState<"lodge" | "ticket">("lodge");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center sm:text-left">
          {t("title")}
        </h1>

        <div
          role="tablist"
          aria-label={t("title")}
          className="mt-4 mb-6 flex justify-center sm:justify-start"
        >
          <div className="inline-flex w-full sm:w-auto rounded-xl overflow-hidden border border-primary-700">
            <button
              role="tab"
              aria-selected={selectedTab === "lodge"}
              onClick={() => setSelectedTab("lodge")}
              className={`w-1/2 sm:w-auto px-4 py-2 text-sm sm:text-base font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                selectedTab === "lodge"
                  ? "bg-primary-700 text-white"
                  : "text-primary-800 hover:bg-primary-700/10"
              }`}
            >
              {t("tabs.lodge")}
            </button>
            <button
              role="tab"
              aria-selected={selectedTab === "ticket"}
              onClick={() => setSelectedTab("ticket")}
              className={`w-1/2 sm:w-auto px-4 py-2 text-sm sm:text-base font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                selectedTab === "ticket"
                  ? "bg-primary-700 text-white"
                  : "text-primary-800 hover:bg-primary-700/10"
              }`}
            >
              {t("tabs.ticket")}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6 lg:p-8 transition-all">
          <div className="transition-all duration-300">
            {selectedTab === "lodge" ? <LodgeReview /> : <TicketReview />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
