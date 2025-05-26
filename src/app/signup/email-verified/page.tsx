"use client";

import { useSignUpMutation } from "@/app/lib/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const EmailVerifPage = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signup, { isLoading }] = useSignUpMutation();

  const params = useSearchParams();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!nickname || !email || !password || !confirmPassword) {
      return alert("Please fill in all fields");
    }

    try {
      await signup({ nickname, email, password }).unwrap();
      alert("Sign up successful! Redirecting to login...");
      router.push("/login");
    } catch (err) {
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-primary-800 font-medium text-sm">Email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-primary-700 rounded-sm px-2 py-1 outline-none"
          />
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">Nickname</p>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border border-primary-700 rounded-sm px-2 py-1 outline-none"
          />
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">Password</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-primary-700 rounded-sm px-2 py-1 outline-none"
            type="password"
          />
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">
            Confirm Password
          </p>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-primary-700 rounded-sm px-2 py-1 outline-none"
            type="password"
          />
        </div>
      </div>

      <button className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500">
        Sign Up
      </button>
    </div>
  );
};

export default EmailVerifPage;
