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
  const [nicknameValid, setNicknameValid] = useState(true);
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
    setNicknameValid(nickname.length >= 4 && nickname.length <= 15);
  }, [password, confirmPassword, nickname]);

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
          {!nicknameValid && (
            <p className="text-red-700 text-sm mt-1">
              Nickname must be 4-15 characters long
            </p>
          )}
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

      <div className="flex flex-row gap-2 items-center">
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
      </div>

      <button className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500">
        Sign Up
      </button>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-primary-800 mb-2">
              Privacy Policy
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              We value your privacy. This policy outlines how we collect, use,
              and protect your personal information.
            </p>

            <h3 className="text-md font-semibold mt-4 mb-1">
              1. Data Collection
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              We collect your email address, nickname, and password during
              signup. This information is used solely for authentication and
              user identification.
            </p>

            <h3 className="text-md font-semibold mt-4 mb-1">2. Data Usage</h3>
            <div className="text-sm text-gray-700 mb-2">
              <p>Your data is used to:</p>
              <ul className="list-disc ml-6 mt-1">
                <li>Allow you to log in securely</li>
                <li>Personalize your experience</li>
                <li>Improve our services</li>
              </ul>
            </div>

            <h3 className="text-md font-semibold mt-4 mb-1">3. Data Storage</h3>
            <p className="text-sm text-gray-700 mb-2">
              Your information is stored securely and encrypted where
              applicable. We do not store plaintext passwords.
            </p>

            <h3 className="text-md font-semibold mt-4 mb-1">4. Data Sharing</h3>
            <p className="text-sm text-gray-700 mb-2">
              We do not share your personal information with third parties
              without your explicit consent, unless required by law.
            </p>

            <h3 className="text-md font-semibold mt-4 mb-1">5. Your Rights</h3>
            <p className="text-sm text-gray-700 mb-2">
              You can request to update or delete your personal information at
              any time. Contact us at{" "}
              <span className="underline">koripSupport@gmail.com.</span>
            </p>

            <h3 className="text-md font-semibold mt-4 mb-1">6. Consent</h3>
            <p className="text-sm text-gray-700">
              By using our services, you consent to the collection and use of
              your information as described in this policy.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmailVerifPage;
