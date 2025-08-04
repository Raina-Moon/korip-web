"use client";

import React, { useState } from "react";
import LodgeReview from "../../../../components/reviews/LodgeReview";
import TicketReview from "../../../../components/reviews/TicketReview";
import { useTranslation } from "react-i18next";

const ReviewsPage = () => {
  const { t } = useTranslation("reviews");
  const [selectedTab, setSelectedTab] = useState<"lodge" | "ticket">("lodge");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          {t("title")}
        </h1>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setSelectedTab("lodge")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedTab === "lodge"
                ? "bg-primary-600 text-white shadow-md"
                : "bg-gray-100 text-primary-800 hover:bg-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
          >
            {t("tabs.lodge")}
          </button>
          <button
            onClick={() => setSelectedTab("ticket")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedTab === "ticket"
                ? "bg-primary-600 text-white shadow-md"
                : "bg-gray-100 text-primary-800 hover:bg-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
          >
            {t("tabs.ticket")}
          </button>
        </div>

        <div className="transition-all duration-300">
          {selectedTab === "lodge" ? <LodgeReview /> : <TicketReview />}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
