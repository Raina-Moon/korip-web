"use client";

import Modal from "@/components/ui/Modal";
import {
  useSignUpMutation,
  useVerifyEmailTokenMutation,
} from "@/lib/auth/authApi";
import { useLocale } from "@/utils/useLocale";
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
      .catch((err:any) => console.error("Failed to verify email", err));
  }, []);

  const handleSubmit = async (formData: {
    nickname: string;
    email: string;
    password: string;
  }) => {
    try {
      await signup(formData).unwrap();
      alert("Signup successful!");
      router.push(`/${locale}/login`);
    } catch (err: any) {
      const status = err?.status;
      const message = err?.data?.message;

      if (status === 403 && message === "Email not verified") {
        alert("Please verify your email first.");
        router.push(`/${locale}/signup/email`);
      } else if (
        status === 404 &&
        message ===
          "Email verification not found. Please request verification again."
      ) {
        alert("Verification expired. Request again.");
        router.push(`/${locale}/signup/email`);
      } else if (status === 409) {
        alert("Nickname or email already taken.");
      } else {
        alert("Signup failed. Try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-primary-800 font-medium text-sm">{t("email")}</p>
          <input
            value={email}
            disabled
            className="border border-primary-700 rounded-md px-2 py-1 outline-none bg-gray-100 cursor-not-allowed text-gray-600"
          />
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">
            {t("nickname")}
          </p>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border border-primary-700 rounded-md px-2 py-1 outline-none"
          />
          {!nicknameValid && (
            <p className="text-red-700 text-sm mt-1">{t("nicknameError")}</p>
          )}
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">
            {t("password")}
          </p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border ${
              passwordValid ? "border-primary-700" : "border-red-700"
            } rounded-md px-2 py-1 outline-none`}
            type="password"
          />
          {!passwordValid && (
            <p className="text-red-700 text-sm mt-1">{t("passwordError")}</p>
          )}
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">
            {t("confirmPassword")}
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
            <p className="text-red-700 text-sm mt-1">{t("passwordMismatch")}</p>
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
          {t("privacyAgree")}
          <button
            onClick={() => setShowModal(true)}
            className="text-primary-700 underline"
          >
            {t("privacyPolicy")}
          </button>
        </label>
      </div>

      <button
        className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
        onClick={() => handleSubmit({ nickname, email, password })}
        disabled={isLoading}
      >
        {isLoading ? t("loading") : t("button")}
      </button>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="p-4">
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
                <li>{t("privacy.sections.usage.content.list.1")}</li>
                <li>{t("privacy.sections.usage.content.list.2")}</li>
                <li>{t("privacy.sections.usage.content.list.3")}</li>
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
              {t("privacy.sections.rights.contact")}
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
