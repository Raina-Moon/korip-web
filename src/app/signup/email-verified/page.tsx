"use client";

import Modal from "@/app/components/ui/Modal";
import { useSignUpMutation } from "@/app/lib/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EmailVerifPage = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [agree, setAgree] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [signup, { isLoading }] = useSignUpMutation();

  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setPasswordMatch(password === confirmPassword);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;
    setPasswordValid(passwordRegex.test(password));
  }, [password, confirmPassword]);

  const handleSignUp = async () => {
    if (!nickname || !email || !password || !confirmPassword) {
      return alert("Please fill in all fields");
    }

    if (!agree) {
      return alert("Please agree to the terms and conditions");
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
            className="border border-primary-700 rounded-md px-2 py-1 outline-none"
          />
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">Nickname</p>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border border-primary-700 rounded-md px-2 py-1 outline-none"
          />
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">Password</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border ${
              passwordValid ? "border-primary-700" : "border-red-700"
            } rounded-md px-2 py-1 outline-none`}
            type="password"
          />
          {!passwordValid && (
            <p className="text-red-700 text-sm mt-1">
              Must be +10 chs, including uppercase, number, and symbol
            </p>
          )}
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">
            Confirm Password
          </p>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`border ${
              passwordMatch ? "border-primary-700" : "border-red-700"
            } rounded-md px-2 py-1 outline-none`}
            type="password"
          />
          {!passwordMatch && (
            <p className="text-red-700 text-sm mt-1">Password do not match</p>
          )}
        </div>
      </div>

      <input
        type="checkbox"
        checked={agree}
        onChange={(e) => setAgree(e.target.checked)}
        className="w-4 h-4"
      />

      <label htmlFor="agree" className="text-sm text-gray-800">
        I agree to the{" "}
        <button
          onClick={() => setShowModal(true)}
          className="text-primary-700 underline"
        >
          Privacy Policy
        </button>
      </label>

      <button className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500">
        Sign Up
      </button>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-primary-800 mb-2">
              Privacy Policy
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Your privacy is important to us. We collect and use your personal
              information only for the purposes of providing our services. We do
              not share your information with third parties without your
              consent.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmailVerifPage;
