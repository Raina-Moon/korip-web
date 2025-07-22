import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";

const sections = [
  { href: "/profile/reservations", label: "Reservations", emoji: "📅" },
  { href: "/profile/reviews", label: "Reviews", emoji: "📝" },
  { href: "/profile/account", label: "Account", emoji: "👤" },
  { href: "/profile/favorites", label: "Favorites", emoji: "❤️" },
  { href: "/profile/settings", label: "Settings", emoji: "⚙️" },
];

const ProfilePage = () => {
  const { t } = useTranslation("profile");
  const locale = useLocale();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-4">
        <img
          src="/images/default-profile.png"
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{t("name")}</h2>
          <p className="text-gray-500">{t("email")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {["reservations", "reviews", "account", "favorites", "settings"].map(
          (key, idx) => (
            <Link
              key={key}
              href={`/${locale}/profile/${key}`}
              className="flex flex-col items-center justify-center p-4 border rounded-lg shadow hover:bg-gray-50 transition"
            >
              <div className="text-3xl mb-2">{sections[idx].emoji}</div>
              <span className="text-sm font-medium">
                {t(`sections.${key}`)}
              </span>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
