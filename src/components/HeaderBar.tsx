import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { logoutUser } from "../lib/auth/logoutThunk";
import i18n from "i18next";
import { useLocale } from "@/utils/useLocale";
import { useTranslation } from "react-i18next";

const HeaderBar = () => {
  const {t} = useTranslation("header");
  const [select, setSelect] = useState(i18n.language || "ko");
  const [isHover, setIsHover] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const locale = useLocale();

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const languages = [
    { name: "English", code: "en" },
    { name: "한국어", code: "ko" },
  ];

  useEffect(() => {
    const updateLanguage = () => {
      setSelect(i18n.language);
    };

    i18n.on("languageChanged", updateLanguage);

    updateLanguage();

    return () => {
      i18n.off("languageChanged", updateLanguage);
    };
  }, []);

  const handleLanguageChange = (lang: string) => {
    setSelect(lang);
    i18n.changeLanguage(lang);
    const pathWithoutLocale = pathname.replace(/^\/(en|ko)/, "");
    router.push(`/${lang}${pathWithoutLocale}`);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push(`/${locale}/`);
  };

  return (
    <div className="flex justify-between items-center px-5 py-3 border-b border-primary-800 bg-white">
      <div>
        <Image
          src="/images/koripsLogo.webp"
          alt="korip logo"
          onClick={() => router.push(`/${locale}/`)}
          width={100}
          height={100}
          className="cursor-pointer"
        />
      </div>
      <div className="flex items-center gap-4 pr-3">
        <select
          value={select}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="border border-primary-800 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <div className="relative">
          <div
            onClick={() => router.push(user ? `/${locale}/profile` : `/${locale}/login`)}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="relative flex items-center justify-center"
          >
            {isHover && (
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-full transition-all duration-300 ease-out scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, rgba(59,130,246,0.3) 20%, rgba(59,130,246,0.05) 70%, transparent 100%)",
                  boxShadow: "0 0 10px rgba(59,130,246,0.2)",
                }}
              />
            )}
            <i
              className="bi bi-person-circle text-primary-800 text-3xl relative z-10 cursor-pointer transition-colors duration-200 hover:text-primary-600"
              style={{ transitionProperty: "color" }}
            ></i>
          </div>

          {isHover && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-3 z-50 animate-dropdown">
              {!user ? (
                <div className="space-y-3">
                  <p className="text-gray-900 text-sm font-medium">{t("loginPrompt")}</p>
                  <button
                    onClick={() => router.push(`/${locale}/login`)}
                    className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    {t("loginButton")}
                  </button>
                </div>
              ) : user.role !== "ADMIN" ? (
                <div className="space-y-3">
                  <p className="text-gray-900 text-sm font-medium">{user.nickname}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="w-full bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    {t("logoutButton")}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-900 text-sm font-medium">{user.nickname}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="w-full bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    {t("logoutButton")}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/${locale}/admin`);
                    }}
                    className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    {t("adminButton")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes dropdown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HeaderBar;
