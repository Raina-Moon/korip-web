"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface LoginPromptModalProps {
  isOpen: boolean;
  context: "lodge/bookmark" | "lodge/reserve" | "ticket/bookmark" | "ticket/reserve" | null;
  onLogin: () => void;
}

export default function LoginPromptModal({
  isOpen,
  context,
  onLogin,
}: LoginPromptModalProps) {
  const {t} = useTranslation("login-prompt");

  if (!isOpen) return null;

  const contextMessages: Record<
    NonNullable<LoginPromptModalProps["context"]>,
    string
  > = {
    "lodge/reserve": t("lodge.reserve"),
    "lodge/bookmark": t("lodge.bookmark"),
    "ticket/bookmark": t("ticket.bookmark"),
    "ticket/reserve": t("ticket.reserve"),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full gap-5 flex flex-col items-center">
      <p className="text-primary-900 text-lg font-medium">
        {context ? contextMessages[context] : ""}
      </p>
      <button
        className="bg-primary-700 text-white rounded-md px-3 py-1 hover:bg-primary-500"
        onClick={onLogin}
      >
        {t("goLogin")}
      </button>
    </div>
  );
}
