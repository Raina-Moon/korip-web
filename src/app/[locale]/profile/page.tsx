"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import { useAppSelector } from "@/lib/store/hooks";

const sections = [
  { href: "/profile/reservations", key: "reservations", emoji: "📅" },
  { href: "/profile/reviews", key: "reviews", emoji: "📝" },
  { href: "/profile/account", key: "account", emoji: "👤" },
  { href: "/profile/favorites", key: "favorites", emoji: "❤️" },
  { href: "/profile/settings", key: "settings", emoji: "⚙️" },
];

const ProfilePage = () => {
  const { t } = useTranslation("profile");
  const user = useAppSelector((state) => state.auth.user);
  const locale = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 sm:mb-6">
        {t("title")}
      </h1>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
          <img
            src="/images/default-profile.webp"
            alt={t("alt.profileImage") || "Profile"}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold leading-tight">
              {user?.nickname || t("unknownUser")}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base break-all">
              {user?.email || t("noEmail")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {sections.map(({ key, emoji }) => (
          <Link
            key={key}
            href={`/${locale}/profile/${key}`}
            aria-label={t(`sections.${key}`)}
            className="group relative flex aspect-square sm:aspect-[4/3] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm transition
                       hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 select-none">
              {emoji}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-800">
              {t(`sections.${key}`)}
            </span>
            <span
              className="pointer-events-none absolute inset-0 rounded-xl ring-0 group-hover:ring-1 group-hover:ring-gray-200"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
