"use client";

import { useRequestVerificationMutation } from "@/lib/auth/authApi";
import { useLocale } from "@/utils/useLocale";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const EmailPage = () => {
  const { t } = useTranslation("email");
  const [email, setEmail] = useState("");
  const [requestVerification, { isLoading, isSuccess }] =
    useRequestVerificationMutation();

  const locale = useLocale();
  console.log("locale", locale);

  const handleSubmit = async () => {
    if (!email) return alert(t("alert.empty"));

    try {
      await requestVerification({ email, locale }).unwrap();
      alert(t("alert.success"));
    } catch (err) {
      alert(t("alert.error"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-primary-800 font-semibold text-3xl mb-5">
        {t("title")}
      </h1>
      <input
        value={email}
        type="email"
        placeholder={t("placeholder")}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-primary-700 rounded-md px-2 py-1 outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-4 bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
      >
        {isLoading ? t("button.loading") : t("button.default")}
      </button>
      {isSuccess && <p className="text-primary-800 mt-4">{t("success")}</p>}
    </div>
  );
};

export default EmailPage;
