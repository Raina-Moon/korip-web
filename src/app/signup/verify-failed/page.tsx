"use client";

import { useRouter } from "next/navigation";
import React from "react";

const VerifFailedPage = () => {
    const router = useRouter();
  return (
    <div>
      <h1 className="text-3xl font-semibold text-primary-800">
        Failed Email Verification
      </h1>
      <p className="text-primary-800 mt-4">
        It seems that your email verification has failed. Please try signing up
        again or contact support if you need assistance.
      </p>
      <button
        onClick={() => router.push("/signup/email")}
        className="bg-primary-700 text-white px-4 py-2 rounded-md mt-4 hover:bg-primary-500"
      >
        Go Back to Email Verification
      </button>
    </div>
  );
};

export default VerifFailedPage;
