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
    <div>
      <p>Email</p>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <p>Nickname</p>
      <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <p>Password</p>
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <p>Confirm Password</p>
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button>Sign Up</button>
    </div>
  );
};

export default EmailVerifPage;
