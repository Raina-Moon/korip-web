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
    <div className="flex justify-between items-center px-5 border-b border-primary-800">
      <div>
        <Image
          src="/images/koriplogo.png"
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
          className="border border-primary-800 rounded-sm px-2 py-1"
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
            className="flex flex-col items-end"
          >
            {isHover && (
              <div className="absolute -inset-[14px]  rounded-full z-0 pointer-events-none">
                <div
                  className="w-[60px] h-[60px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59,130,246,0.4) 20%, rgba(59,130,246,0.05) 70%, transparent 100%)",
                  }}
                />
              </div>
            )}

            <i className="bi bi-person-circle text-primary-800 text-3xl relative z-10 cursor-pointer"></i>

            {isHover && (
              <div className="absolute right-0 mt-8 w-56 bg-white border border-gray-300 shadow-xl rounded p-3 z-50">
                {!user ? (
                  <div>
                    <p>{t("loginPrompt")}</p>
                    <button
                      onClick={() => router.push(`/${locale}/login`)}
                      className="bg-primary-700 text-white rounded-md px-2 py-1 hover:bg-primary-500"
                    >
                      {t("loginButton")}
                    </button>
                  </div>
                ) : user.role !== "ADMIN" ? (
                  <div>
                    <p>{user.nickname}</p>
                    <p>{user.email}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="bg-red-600 text-white rounded-md px-2 py-1 hover:bg-red-500"
                    >
                      {t("logoutButton")}
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>{user.nickname}</p>
                    <p>{user.email}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="bg-red-600 text-white rounded-md px-2 py-1 hover:bg-red-500"
                    >
                      {t("logoutButton")}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/${locale}/admin`);
                      }}
                      className="bg-primary-700 text-white rounded-md px-2 py-1 hover:bg-primary-500 mt-2"
                    >
                      {t("adminButton")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
