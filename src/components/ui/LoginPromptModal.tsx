"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface LoginPromptModalProps {
  isOpen: boolean;
  context:
    | "lodge/bookmark"
    | "lodge/reserve"
    | "ticket/bookmark"
    | "ticket/reserve"
    | null;
  onLogin: () => void;
}

export default function LoginPromptModal({
  isOpen,
  context,
  onLogin,
}: LoginPromptModalProps) {
  const { t } = useTranslation("login-prompt");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const contextMessages: Record<
    NonNullable<LoginPromptModalProps["context"]>,
    string
  > = {
    "lodge/reserve": t("lodge.reserve"),
    "lodge/bookmark": t("lodge.bookmark"),
    "ticket/bookmark": t("ticket.bookmark"),
    "ticket/reserve": t("ticket.reserve"),
  };

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => buttonRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const label = context ? contextMessages[context] : t("goLogin");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
      className="
        w-full
        max-w-sm sm:max-w-md md:max-w-lg
        bg-white
        rounded-t-2xl sm:rounded-2xl
        shadow-xl
        p-4 sm:p-6
        flex flex-col items-center gap-4 sm:gap-5
        text-center
      "
    >
      <h2
        id="login-prompt-title"
        className="text-base sm:text-lg font-semibold text-primary-900"
      >
        {label}
      </h2>

      <button
        ref={buttonRef}
        onClick={onLogin}
        className="
          w-full sm:w-auto
          px-4 py-2
          rounded-lg
          bg-primary-700 text-white
          text-sm sm:text-base
          hover:bg-primary-600
          focus:outline-none focus:ring-2 focus:ring-primary-400
        "
      >
        {t("goLogin")}
      </button>
    </div>
  );
}
