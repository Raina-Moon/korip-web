"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { sendResetCode } from "@/lib/reset-password/resetPasswordThunk";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import { showLoading, hideLoading } from "@/lib/store/loadingSlice";

const ResetPwdPage = () => {
  const { t } = useTranslation("reset-pwd");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(showLoading());

    try {
      await dispatch(sendResetCode({ email, locale })).unwrap();
      router.push(`/${locale}/reset-password/verify-reset?email=${email}`);
    } catch (err) {
      if (typeof err === "string") {
        alert(err);
      } else if (err && typeof err === "object" && "message" in err) {
        alert((err as { message: string }).message);
      } else {
        alert(t("alert.error"));
      }
      console.error("Error during password reset:", err);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {t("title")}
        </h2>

        <input
          type="email"
          id="email"
          placeholder={t("placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
        />

        <button
          type="submit"
          className="bg-primary-700 hover:bg-primary-500 text-white font-medium py-2 rounded-md transition"
        >
          {t("button")}
        </button>
      </form>
      <p className="text-sm text-gray-700 mt-4">
        {t("signupPrompt.text")}{" "}
        <a
          href={`/${locale}/signup/email`}
          className="text-primary-700 hover:underline font-medium"
        >
          {t("signupPrompt.link")}
        </a>
      </p>
    </div>
  );
};

export default ResetPwdPage;
