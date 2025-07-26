"use client";

import { useRequestVerificationMutation } from "@/lib/auth/authApi";
import { useLocale } from "@/utils/useLocale";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const VERIFY_DURATION_SECONDS = 15 * 60;
const LOCALSTORAGE_KEY = "email_verif_last_req";

const EmailPage = () => {
  const { t } = useTranslation("email");
  const [email, setEmail] = useState("");
  const [requestVerification, { isLoading, isSuccess }] =
    useRequestVerificationMutation();
  const [remaining, setRemaining] = useState(0);

  const locale = useLocale();

  const handleSubmit = async () => {
    if (!email) return alert(t("alert.empty"));

    try {
      await requestVerification({ email, locale }).unwrap();
      const now = Date.now();
      localStorage.setItem(
        LOCALSTORAGE_KEY,
        JSON.stringify({ email, at: now })
      );
      setRemaining(VERIFY_DURATION_SECONDS);

      alert(t("alert.success"));
    } catch (err: any) {
      const status = err?.status;
      const msg = err?.data?.message || t("alert.error");

      if (status === 409) {
        alert(t("alert.alreadyRegistered"));
      } else if (status === 429) {
        alert(t("alert.alreadyRequested"));
      } else {
        alert(msg);
      }
    }
  };

  useEffect(() => {
    const item = localStorage.getItem(LOCALSTORAGE_KEY);
    if (item) {
      try {
        const { email: reqEmail, at } = JSON.parse(item);
        if (reqEmail === email) {
          const passed = Math.floor((Date.now() - at) / 1000);
          const remain = VERIFY_DURATION_SECONDS - passed;
          setRemaining(remain > 0 ? remain : 0);
        }
      } catch {}
    }
  }, [email]);

  useEffect(() => {
    if (remaining === 0) return;
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining]);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
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
        disabled={isLoading || remaining > 0}
        className="mt-4 bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
      >
        {isLoading ? t("button.loading") : t("button.default")}
      </button>
      {isSuccess && (
        <div className="text-primary-800 mt-4 flex flex-col items-center">
          <p>{t("success")}</p>
          <p className="text-sm mt-1">
            {t("timer.label")}{" "}
            <span className="font-mono">{formatTime(remaining)}</span>
          </p>
        </div>
      )}{" "}
    </div>
  );
};

export default EmailPage;
