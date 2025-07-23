"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { sendResetCode } from "@/lib/reset-password/resetPasswordThunk";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";

const ResetPwdPage = () => {
  const {t} = useTranslation("reset-pwd");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(sendResetCode(email));
      if (sendResetCode.fulfilled.match(result)) {
        router.push(`/${locale}/reset-password/verify-reset?email=${email}`);
      } else {
        alert(result.payload)
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      alert(t("alert.error"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <h2 className="text-3xl">{t("title")}</h2>
        <input
          type="email"
          id="email"
          placeholder={t("placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-primary-700 rounded-md px-2 py-1 outline-none w-full max-w-md"
        />
        <button
          type="submit"
          className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
        >
          {t("button")}
        </button>
      </form>
      <p className="text-primary-800 text-sm">
        {t("signupPrompt.text")}{" "}
        <a href={`/${locale}/signup/email`} className="text-primary-700 hover:underline">
          {t("signupPrompt.link")}
        </a>
      </p>
    </div>
  );
};

export default ResetPwdPage;
