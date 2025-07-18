"use client";

import React, { useState } from "react";
import LodgeReview from "./LodgeReview";
import TicketReview from "./TicketReview";

const ReviewsPage = () => {
  const [selectedTab, setSelectedTab] = useState<"lodge" | "ticket">("lodge");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedTab("lodge")}
          className={`px-4 py-2 rounded ${
            selectedTab === "lodge"
              ? "bg-primary-700 text-white"
              : "bg-gray-100 text-primary-800"
          }`}
        >
          숙소 리뷰
        </button>
        <button
          onClick={() => setSelectedTab("ticket")}
          className={`px-4 py-2 rounded ${
            selectedTab === "ticket"
              ? "bg-primary-700 text-white"
              : "bg-gray-100 text-primary-800"
          }`}
        >
          티켓 리뷰
        </button>
      </div>

      {selectedTab === "lodge" ? <LodgeReview /> : <TicketReview />}
    </div>
  );
};

export default ReviewsPage;
