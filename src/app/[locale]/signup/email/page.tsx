"use client";

import { useRequestVerificationMutation } from "@/lib/auth/authApi";
import { useLocale } from "@/utils/useLocale";
import { Info } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const VERIFY_DURATION_SECONDS = 15 * 60;
const LOCALSTORAGE_KEY = "email_verif_last_req";

const EmailPage = () => {
  const { t } = useTranslation("email");
  const [email, setEmail] = useState("");
  const [requestVerification, { isLoading, isSuccess }] =
    useRequestVerificationMutation();
  const [remaining, setRemaining] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!showTip) return;
    const handler = (e: MouseEvent) => {
      if (tipRef.current && !tipRef.current.contains(e.target as Node)) {
        setShowTip(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [showTip]);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white px-8 py-10 flex flex-col items-center gap-6 border border-gray-200">
        <h1 className="text-primary-800 font-bold text-2xl sm:text-3xl mb-3">
          {t("title")}
        </h1>
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-1 mb-1 relative group">
            <span className="text-gray-700 font-medium text-base">
              {t("instruction.short")}
            </span>
            <button
              type="button"
              aria-label="More info"
              tabIndex={0}
              className="text-primary-600 hover:text-primary-800 outline-none focus-visible:text-primary-800 relative"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              onClick={() => setShowTip((v) => !v)}
            >
              <Info size={18} />
              {showTip && (
                <div
                  ref={tipRef}
                  className="absolute left-full top-1 z-20 ml-2 w-64 bg-white border border-gray-300 rounded-lg p-3 shadow-lg text-sm text-gray-700 animate-fadeIn"
                  style={{
                    minWidth: "220px",
                    maxWidth: "300px",
                  }}
                >
                  {t("instruction.long")}
                </div>
              )}
            </button>
          </div>
          <input
            id="email"
            value={email}
            type="email"
            placeholder={t("placeholder")}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
            autoFocus
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || remaining > 0}
          className={`
            mt-2 w-full py-2 rounded-lg font-semibold text-base transition
            ${
              isLoading || remaining > 0
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-primary-700 text-white hover:bg-primary-500 active:bg-primary-800 shadow-md"
            }
          `}
        >
          {isLoading ? t("button.loading") : t("button.default")}
        </button>

        {(isSuccess || remaining > 0) && (
          <div className="w-full text-center bg-blue-50 border border-blue-200 text-primary-800 rounded-lg p-3 animate-fadeIn">
            <p className="font-medium">{t("success")}</p>
            <p className="text-xs mt-1 text-primary-600">
              {t("timer.label")}{" "}
              <span className="font-mono tracking-wide">
                {formatTime(remaining)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailPage;
