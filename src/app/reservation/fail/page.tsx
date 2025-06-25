"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

const FailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const message = searchParams.get("message") || "결제가 실패하였습니다.";
  const code = searchParams.get("code");
  const lodgeId = searchParams.get("lodgeId");

  const handleBack = () => {
    if (lodgeId) {
      router.push(`/lodge/${lodgeId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">결제 실패 😢</h1>
      <p className="mb-2">사유: {message}</p>
      {code && <p className="mb-6 text-gray-500 text-sm">에러 코드: {code}</p>}

      <button
        onClick={handleBack}
        className="bg-primary-700 text-white px-6 py-2 rounded hover:bg-primary-500"
      >
        돌아가기
      </button>
    </div>
  );
};

export default FailPage;
