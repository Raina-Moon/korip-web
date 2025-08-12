"use client";

import { useRequestVerificationMutation } from "@/lib/auth/authApi";
import { useLocale } from "@/utils/useLocale";
import { Info } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
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
    if (!email) return toast.error(t("alert.empty"));

    try {
      await requestVerification({ email, locale }).unwrap();
      const now = Date.now();
      localStorage.setItem(
        LOCALSTORAGE_KEY,
        JSON.stringify({ email, at: now })
      );
      setRemaining(VERIFY_DURATION_SECONDS);

      toast.success(t("alert.success"));
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        "data" in err &&
        typeof (err as any).data === "object"
      ) {
        const status = (err as any).status;
        const msg = (err as any).data?.message || t("alert.error");

        if (status === 409) {
          toast.error(t("alert.alreadyRegistered"));
        } else if (status === 429) {
          toast.error(t("alert.alreadyRequested"));
        } else {
          toast.error(msg);
        }
      } else {
        toast.error(t("alert.error"));
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl shadow-xl bg-white px-6 sm:px-8 md:px-10 py-8 sm:py-10 flex flex-col items-center gap-6 border border-gray-200">
        <h1 className="text-primary-800 font-bold text-xl sm:text-2xl md:text-3xl text-center mb-1 sm:mb-2">
          {t("title")}
        </h1>

        <div className="w-full flex flex-col gap-2">
          <div className="flex items-start sm:items-center gap-2 mb-1">
            <span className="text-gray-700 font-medium text-sm sm:text-base leading-snug">
              {t("instruction.short")}
            </span>

            <div className="relative inline-block">
              <button
                type="button"
                aria-label="More info"
                tabIndex={0}
                className="text-primary-600 hover:text-primary-800 outline-none focus-visible:text-primary-800"
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
                onClick={() => setShowTip((v) => !v)}
              >
                <Info size={18} />
                {showTip && (
                  <div
                    ref={tipRef}
                    className={[
                      "absolute z-50 px-3 py-2 rounded-lg border shadow-lg bg-white text-gray-700",
                      "text-xs sm:text-sm leading-relaxed break-words",
                      "w-64 max-w-[calc(100vw-2rem)]",
                      "left-1/2 -translate-x-1/2 top-[calc(100%+8px)]",
                      "sm:top-auto sm:bottom-[calc(100%+8px)] sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-0",
                      "md:bottom-auto md:top-1/2 md:left-full md:ml-2 md:translate-x-0 md:-translate-y-1/2",
                    ].join(" ")}
                  >
                    {t("instruction.long")}
                  </div>
                )}
              </button>
            </div>
          </div>

          <input
            id="email"
            value={email}
            type="email"
            placeholder={t("placeholder")}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-200 w-full"
            autoFocus
            autoComplete="email"
            inputMode="email"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || remaining > 0}
          className={[
            "mt-2 w-full rounded-lg font-semibold transition",
            "text-sm sm:text-base",
            isLoading || remaining > 0
              ? "bg-gray-300 text-gray-400 cursor-not-allowed py-2.5"
              : "bg-primary-700 text-white hover:bg-primary-500 active:bg-primary-800 shadow-md py-2.5 sm:py-3",
          ].join(" ")}
        >
          {isLoading ? t("button.loading") : t("button.default")}
        </button>

        {(isSuccess || remaining > 0) && (
          <div
            className="w-full text-center bg-blue-50 border border-blue-200 text-primary-800 rounded-lg p-3 animate-fadeIn"
            aria-live="polite"
          >
            <p className="font-medium text-sm sm:text-base">{t("success")}</p>
            <p className="text-xs sm:text-sm mt-1 text-primary-600">
              {t("timer.label")}{" "}
              <span className="font-mono tracking-wide">
                {formatTime(remaining)}
              </span>
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fade-in 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EmailPage;
