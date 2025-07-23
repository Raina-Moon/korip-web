"use client";

import { useRequestVerificationMutation } from "@/lib/auth/authApi";
import React, { useState } from "react";

const EmailPage = () => {
  const [email, setEmail] = useState("");
  const [requestVerification, { isLoading, isSuccess }] =
    useRequestVerificationMutation();

  const handleSubmit = async () => {
    if (!email) return alert("Please enter an email address");

    try {
      await requestVerification({ email }).unwrap();
      alert("Verification email sent successfully!");
    } catch (err) {
      alert("Failed to send verification email. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-primary-800 font-semibold text-3xl mb-5">
        Email Verification
      </h1>
      <input
        value={email}
        type="email"
        placeholder="example@mail.com"
        onChange={(e) => setEmail(e.target.value)}
        className="border border-primary-700 rounded-md px-2 py-1 outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-4 bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
      >
        {isLoading ? "Sending..." : "Send Verification Email"}
      </button>
      {isSuccess && (
        <p className="text-primary-800 mt-4">
          Check your email for the verification link!
        </p>
      )}
    </div>
  );
};

export default EmailPage;
