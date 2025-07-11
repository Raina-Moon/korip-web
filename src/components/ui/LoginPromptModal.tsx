"use client";

import React from "react";

interface LoginPromptModalProps {
  isOpen: boolean;
  context: string | null;
  onLogin: () => void;
}

export default function LoginPromptModal({
  isOpen,
  context,
  onLogin,
}: LoginPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div
    className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full gap-5 flex flex-col items-center">
      <p className="text-primary-900 text-lg font-medium">
        {context === "reserve" && "로그인 후 숙소 예약을 완료할 수 있어요."}
        {context === "bookmark" && "로그인 후 이 숙소를 찜할 수 있어요."}
      </p>
      <button
        className="bg-primary-700 text-white rounded-md px-3 py-1 hover:bg-primary-500"
        onClick={onLogin}
      >
        로그인하러 가기
      </button>
    </div>
  );
}
