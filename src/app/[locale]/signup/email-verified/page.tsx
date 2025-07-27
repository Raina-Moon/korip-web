"use client";

import Modal from "@/components/ui/Modal";
import {
  useSignUpMutation,
  useVerifyEmailTokenMutation,
} from "@/lib/auth/authApi";
import { useLocale } from "@/utils/useLocale";
import { Check, Lock, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const EmailVerifPage = () => {
  const { t } = useTranslation("email-verif");
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
  const [verifyEmailToken] = useVerifyEmailTokenMutation();

  const searchParams = useSearchParams();

  const router = useRouter();

  const locale = useLocale();

  useEffect(() => {
    setPasswordMatch(password === confirmPassword);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;
    setPasswordValid(passwordRegex.test(password));
    setNicknameValid(nickname.length >= 4 && nickname.length <= 15);
  }, [password, confirmPassword, nickname]);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.email) {
        setEmail(payload.email);
      }
    } catch (err) {
      console.error("Invalid token");
    }
    verifyEmailToken({ token })
      .unwrap()
      .then(() => console.log("Successfully verified email"))
      .catch((err: any) => console.error("Failed to verify email", err));
  }, []);

  const handleSubmit = async (formData: {
    nickname: string;
    email: string;
    password: string;
  }) => {
    try {
      await signup(formData).unwrap();
      alert(t("signupSuccess"));
      router.push(`/${locale}/login`);
    } catch (err: any) {
      const status = err?.status;
      const message = err?.data?.message;

      if (status === 403 && message === "Email not verified") {
        alert(t("alert.notVerified"));
        router.push(`/${locale}/signup/email`);
      } else if (
        status === 404 &&
        message ===
          "Email verification not found. Please request verification again."
      ) {
        alert(t("alert.notVerified"));
        router.push(`/${locale}/signup/email`);
      } else if (status === 409) {
        alert(t("alert.expired"));
      } else {
        alert(t("alert.signupFail"));
      }
    }
  };

 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white px-8 py-10 flex flex-col gap-7 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 text-center mb-2">
          {t("title")}
        </h1>

        {/* Email (disabled) */}
        <div>
          <label className="text-primary-700 text-sm font-medium mb-1 block" htmlFor="email">
            {t("email")}
          </label>
          <div className="relative">
            <input
              value={email}
              disabled
              id="email"
              className="pl-10 border border-gray-300 rounded-lg px-4 py-2 outline-none bg-gray-100 text-gray-500 w-full cursor-not-allowed"
            />
            <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        {/* Nickname */}
        <div>
          <label className="text-primary-700 text-sm font-medium mb-1 block" htmlFor="nickname">
            {t("nickname")}
          </label>
          <div className="relative">
            <input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={`pl-10 border ${
                nicknameValid ? "border-gray-300" : "border-red-400"
              } rounded-lg px-4 py-2 outline-none w-full focus:border-primary-500`}
              autoComplete="off"
            />
            <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          {!nicknameValid && (
            <p className="text-red-600 text-xs mt-1">{t("nicknameError")}</p>
          )}
        </div>
        {/* Password */}
        <div>
          <label className="text-primary-700 text-sm font-medium mb-1 block" htmlFor="password">
            {t("password")}
          </label>
          <div className="relative">
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 border ${
                passwordValid ? "border-gray-300" : "border-red-400"
              } rounded-lg px-4 py-2 outline-none w-full focus:border-primary-500`}
              type="password"
              autoComplete="new-password"
            />
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          {!passwordValid && (
            <p className="text-red-600 text-xs mt-1">{t("passwordError")}</p>
          )}
        </div>
        {/* Confirm Password */}
        <div>
          <label className="text-primary-700 text-sm font-medium mb-1 block" htmlFor="confirmPassword">
            {t("confirmPassword")}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`pl-10 border ${
                passwordMatch ? "border-gray-300" : "border-red-400"
              } rounded-lg px-4 py-2 outline-none w-full focus:border-primary-500`}
              type="password"
              autoComplete="new-password"
            />
            <Check className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          {!passwordMatch && (
            <p className="text-red-600 text-xs mt-1">{t("passwordMismatch")}</p>
          )}
        </div>

        {/* Privacy Agree */}
        <div className="flex flex-row gap-2 items-center mt-2 mb-2">
          <input
            id="agree"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-4 h-4 accent-primary-700 focus:ring-2 focus:ring-primary-200"
          />
          <label htmlFor="agree" className="text-sm text-gray-800 cursor-pointer">
            {t("privacyAgree")}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-primary-700 underline ml-1"
            >
              {t("privacyPolicy")}
            </button>
          </label>
        </div>

        <button
          className={`
            mt-2 w-full py-2 rounded-lg font-semibold text-base transition
            ${isLoading || !agree
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-primary-700 text-white hover:bg-primary-500 active:bg-primary-800 shadow-md"
            }
          `}
          onClick={() => handleSubmit({ nickname, email, password })}
          disabled={isLoading || !agree}
        >
          {isLoading ? t("loading") : t("button")}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="p-4 max-w-xl">
            <h2 className="text-lg font-semibold text-primary-800 mb-2">
              {t("privacy.title")}
            </h2>
            <p className="text-sm text-gray-700 mb-2">{t("privacy.intro")}</p>
            <h3 className="text-md font-semibold mt-4 mb-1">
              {t("privacy.sections.collection.title")}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              {t("privacy.sections.collection.content")}
            </p>
            <h3 className="text-md font-semibold mt-4 mb-1">
              {t("privacy.sections.usage.title")}
            </h3>
            <div className="text-sm text-gray-700 mb-2">
              <p>{t("privacy.sections.usage.content.intro")}</p>
              <ul className="list-disc ml-6 mt-1">
                <li>{t("privacy.sections.usage.content.list.0")}</li>
                <li>{t("privacy.sections.usage.content.list.1")}</li>
                <li>{t("privacy.sections.usage.content.list.2")}</li>
              </ul>
            </div>
            <h3 className="text-md font-semibold mt-4 mb-1">
              {t("privacy.sections.storage.title")}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              {t("privacy.sections.storage.content")}
            </p>
            <h3 className="text-md font-semibold mt-4 mb-1">
              {t("privacy.sections.sharing.title")}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              {t("privacy.sections.sharing.content")}
            </p>
            <h3 className="text-md font-semibold mt-4 mb-1">
              {t("privacy.sections.rights.title")}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              {t("privacy.sections.rights.content")}
              <br />
            </p>
            <h3 className="text-md font-semibold mt-4 mb-1">
              {t("privacy.sections.consent.title")}
            </h3>
            <p className="text-sm text-gray-700">
              {t("privacy.sections.consent.content")}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmailVerifPage;
