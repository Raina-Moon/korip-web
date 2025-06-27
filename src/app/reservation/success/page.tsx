"use client";

import { useRouter } from "next/navigation";
import React from "react";

const ReservationSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-primary-800">예약 확정 🎉</h1>
      <p className="text-lg text-gray-700 mb-6">아래 내용을 확인해주세요.</p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => router.push("/")}
          className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-white hover:border hover:border-primary-700 hover:text-primary-700 cursor-pointer"
        >
          홈으로 가기
        </button>
        <button
          onClick={() => router.push("/reservations")}
          className="border border-primary-700 text-primary-800 px-4 py-2 rounded hover:bg-primary-700 hover:text-white cursor-pointer"
        >
          예약 리스트 보러가기
        </button>
      </div>
    </div>
  );
};

export default ReservationSuccessPage;
