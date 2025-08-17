import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { logoutUser } from "../lib/auth/logoutThunk";
import i18n from "i18next";
import { useLocale } from "@/utils/useLocale";
import SideMenu from "./SideMenu";
import { Menu } from "lucide-react";

const HeaderBar = () => {
  const [select, setSelect] = useState(i18n.language || "ko");

  const [menuOpen, setMenuOpen] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);

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

  useEffect(() => {
    const check = () =>
      setIsDesktop(
        typeof window !== "undefined" &&
          window.matchMedia("(min-width: 768px)").matches
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLanguageChange = (lang: string) => {
    setSelect(lang);
    i18n.changeLanguage(lang);
    const pathWithoutLocale = pathname.replace(/^\/(en|ko)/, "");
    router.push(`/${lang}${pathWithoutLocale || "/"}`);
  };

  const toggleMobileLang = () => {
    const next = select === "en" ? "ko" : "en";
    handleLanguageChange(next);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push(`/${locale}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary-800 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-4 md:h-16">
        <button
          onClick={() => router.push(`/${locale}/`)}
          className="flex items-center"
          aria-label="Go to home"
        >
          <Image
            src="/images/koripsLogo.webp"
            alt="korip logo"
            width={128}
            height={40}
            className="w-20 md:w-30 h-auto"
            priority
          />
        </button>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleMobileLang}
            className="inline-flex md:hidden items-center rounded-lg border border-primary-800 px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 active:scale-95 transition"
            aria-label="Toggle language"
          >
            {select === "en" ? "EN" : "KO"}
          </button>

          <select
            value={select}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="hidden md:inline-block border border-primary-800 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
            aria-label="Select language"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="relative h-10 w-10 inline-flex items-center justify-center"
          >
            <Menu className="h-5 w-5 text-primary-800" aria-hidden="true" />
          </button>
        </div>
      </div>

      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        locale={locale}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default HeaderBar;
