import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react"; // useRef ⬅️ 추가
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { logoutUser } from "../lib/auth/logoutThunk";
import i18n from "i18next";
import { useLocale } from "@/utils/useLocale";
import { useTranslation } from "react-i18next";

const HeaderBar = () => {
  const { t } = useTranslation("header");
  const [select, setSelect] = useState(i18n.language || "ko");

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
      setIsDesktop(typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches);
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

  const goProfile = () => {
    router.push(user ? `/${locale}/profile` : `/${locale}/login`);
  };

  const onProfileEnter = () => isDesktop && setMenuOpen(true);
  const onProfileLeave = () => isDesktop && setMenuOpen(false);

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
            className="w-20 md:w-32 h-auto"
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

          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={onProfileEnter}
            onMouseLeave={onProfileLeave}
          >
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Account menu"
            >
              <span
                className={`absolute inset-0 rounded-full transition-opacity ${
                  menuOpen ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "radial-gradient(circle, rgba(59,130,246,0.25) 20%, rgba(59,130,246,0.06) 70%, transparent 100%)",
                  boxShadow: "0 0 10px rgba(59,130,246,0.18)",
                }}
                aria-hidden="true"
              />
              <i className="bi bi-person-circle text-primary-800 text-2xl md:text-3xl relative z-10" />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-3 z-50 animate-dropdown"
              >
                {!user ? (
                  <div className="space-y-3">
                    <p className="text-gray-900 text-sm font-medium">
                      {t("loginPrompt")}
                    </p>
                    <button
                      onClick={() => router.push(`/${locale}/login`)}
                      className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
                    >
                      {t("loginButton")}
                    </button>
                  </div>
                ) : user.role !== "ADMIN" ? (
                  <div className="space-y-3">
                    <div className="min-w-0">
                      <p className="text-gray-900 text-sm font-semibold truncate">
                        {user.nickname}
                      </p>
                      <p className="text-gray-600 text-xs truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={goProfile}
                      className="md:hidden w-full border border-primary-600 text-primary-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
                    >
                      {t("profileButton")}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                    >
                      {t("logoutButton")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="min-w-0">
                      <p className="text-gray-900 text-sm font-semibold truncate">
                        {user.nickname}
                      </p>
                      <p className="text-gray-600 text-xs truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={goProfile}
                      className="md:hidden w-full border border-primary-600 text-primary-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
                    >
                      {t("profileButton")}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                    >
                      {t("logoutButton")}
                    </button>
                    <button
                      onClick={() => router.push(`/${locale}/admin`)}
                      className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
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

      <style jsx>{`
        @keyframes dropdown {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.18s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default HeaderBar;
