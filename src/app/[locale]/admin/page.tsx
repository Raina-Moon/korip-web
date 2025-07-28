"use client";
export const runtime = 'edge';

import { useLocale } from "@/utils/useLocale";
import Link from "next/link";
import React from "react";

const AdminPage = () => {
  const locale = useLocale();

  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          관리자 대시보드
        </h1>
        <p className="text-gray-600 mb-4">
          이곳은 관리자 전용 페이지입니다. 아래 메뉴에서 원하는 관리 작업을
          선택하세요.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            <span className="font-semibold">사용자 관리</span>: 사용자 계정 목록
            조회 및 삭제
          </li>
          <li>
            <span className="font-semibold">온천장 관리</span>: 온천장(Lodge)
            생성 및 목록 관리
          </li>
          <li>
            <span className="font-semibold">신고된 리뷰 관리</span>: 사용자가
            신고한 리뷰 확인 및 처리
          </li>
          <li>
            <span className="font-semibold">예약 관리</span>: 예약 목록 조회 및
            상태 변경
          </li>
        </ul>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href={`/${locale}/admin/users`}>
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-purple-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5-2.24M9 20H4v-2a3 3 0 015-2.24M12 12a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-800">사용자 관리</h2>
            <p className="text-gray-500 mt-2">사용자 계정 목록 조회 및 삭제</p>
          </div>
        </Link>

        <Link href={`/${locale}/admin/lodge`}>
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 0a2 2 0 01-2 2H9a2 2 0 01-2-2m8-4V5a2 2 0 00-2-2H9a2 2 0 00-2 2v7"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-800">온천장 관리</h2>
            <p className="text-gray-500 mt-2">
              새로운 온천장 생성 및 목록 조회
            </p>
          </div>
        </Link>
        <Link href={`/${locale}/admin/reports`}>
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-800">
              신고된 리뷰 관리
            </h2>
            <p className="text-gray-500 mt-2">신고된 리뷰 확인 및 숨김·삭제</p>
          </div>
        </Link>
        <Link href={`/${locale}/admin/reservations`}>
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-800">예약 관리</h2>
            <p className="text-gray-500 mt-2">예약 목록 조회 및 상태 변경</p>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default AdminPage;
