"use client";

import React from "react";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="bg-white px-8 py-12 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
        <Settings className="w-12 h-12 text-primary-600 animate-pulse" />
        <h1 className="text-2xl font-semibold text-gray-800">페이지 준비 중</h1>
        <p className="text-gray-600 text-center">
          설정 페이지는 곧 제공될 예정입니다. <br />
          조금만 기다려 주세요!
        </p>
      </div>
    </div>
  );
}
