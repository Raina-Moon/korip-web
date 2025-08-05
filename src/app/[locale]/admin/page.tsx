"use client";

import AdminCard from "@/components/admin/AdminCard";
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
          <AdminCard
            iconColor="text-purple-500"
            title="사용자 관리"
            description="사용자 계정 목록 조회 및 삭제"
            iconPath="M17 20h5v-2a3 3 0 00-5-2.24M9 20H4v-2a3 3 0 015-2.24M12 12a4 4 0 100-8 4 4 0 000 8z"
          />
        </Link>

        <Link href={`/${locale}/admin/lodge`}>
          <AdminCard
            iconColor="text-blue-500"
            title="온천장 관리"
            description="새로운 온천장 생성 및 목록 조회"
            iconPath="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 0a2 2 0 01-2 2H9a2 2 0 01-2-2m8-4V5a2 2 0 00-2-2H9a2 2 0 00-2 2v7"
          />
        </Link>
        <Link href={`/${locale}/admin/reports`}>
          <AdminCard
            iconColor="text-red-500"
            title="신고된 리뷰 관리"
            description="신고된 리뷰 확인 및 숨김·삭제"
            iconPath="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"
          />
        </Link>
        <Link href={`/${locale}/admin/reservations`}>
          <AdminCard
            iconColor="text-green-500"
            title="예약 관리"
            description="예약 목록 조회 및 상태 변경"
            iconPath="M5 13l4 4L19 7"
          />
        </Link>

        <Link href={`/${locale}/admin/news`}>
          <AdminCard
            iconColor="text-yellow-500"
            title="뉴스 관리"
            description="뉴스 게시글 작성 및 목록 관리"
            iconPath="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"
          />
        </Link>

        <Link href={`/${locale}/admin/events`}>
          <AdminCard
            iconColor="text-pink-500"
            title="이벤트 관리"
            description="이벤트 게시글 작성 및 목록 관리"
            iconPath="M12 8c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0 2c-2.21 0-4 1.79-4 4v4h8v-4c0-2.21-1.79-4-4-4z"
          />
        </Link>
      </section>
    </div>
  );
};

export default AdminPage;
