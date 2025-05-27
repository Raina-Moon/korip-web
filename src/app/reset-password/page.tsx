"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { sendResetCode } from "../lib/reset-password/resetPasswordThunk";

const ResetPwdPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(sendResetCode(email));
      if (sendResetCode.fulfilled.match(result)) {
        router.push(`/reset-password/verify-reset?email=${email}`);
      } else {
        alert(result.payload)
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      alert("Unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <h2 className="text-3xl">We'll send you the code</h2>
        <input
          type="email"
          id="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-primary-700 rounded-md px-2 py-1 outline-none w-full max-w-md"
        />
        <button
          type="submit"
          className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
        >
          Send
        </button>
      </form>
      <p className="text-primary-800 text-sm">
        Don't have an account?{" "}
        <a href="/signup/email" className="text-primary-700 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default ResetPwdPage;
