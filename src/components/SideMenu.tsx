// SideMenu.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import {
  Home,
  User,
  ChevronDown,
  ChevronRight,
  UserCog,
  Heart,
  CalendarDays,
  MessageSquare,
  Settings as SettingsIcon,
  HelpCircle,
  Mail,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

type UserT = {
  nickname: string;
  role?: "ADMIN" | "USER" | string;
  email?: string;
} | null;

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
  user?: UserT;
  locale: string;
  onLogout: () => Promise<void>;
};

const SideMenu: React.FC<SideMenuProps> = ({
  open,
  onClose,
  user,
  locale,
  onLogout,
}) => {
  const { t } = useTranslation("header");
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLElement>(null);

  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const [profileOpen, setProfileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    if (pathname?.replace(`/${locale}`, "").startsWith("/profile")) {
      setProfileOpen(true);
    }
    if (pathname?.replace(`/${locale}`, "").startsWith("/help")) {
      setSupportOpen(true);
    }
  }, [pathname, locale]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeydown);
      document.addEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleNavigation = (path: string) => {
    onClose();
    router.push(`/${locale}${path}`);
  };

  const isActive = (path: string) => {
    const full = `/${locale}${path}`;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[998] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Side menu"
        className={`fixed top-0 right-0 z-[999] h-[100dvh] w-80 max-w-[88%]
          bg-[#FAFAFA] shadow-2xl border-l border-gray-200
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
          pt-[max(12px,env(safe-area-inset-top))]
          pr-[max(12px,env(safe-area-inset-right))]
          pb-[max(12px,env(safe-area-inset-bottom))]
          pl-4
        `}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 shrink-0 pr-2">
          <h2 className="text-base font-semibold text-primary-900">Menu</h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              aria-label={
                isDark
                  ? t("lightMode", { defaultValue: "Light mode" })
                  : t("darkMode", { defaultValue: "Dark mode" })
              }
              className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {mounted &&
                (isDark ? (
                  <Sun className="h-5 w-5 text-gray-700" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                ))}
            </button>

            <button
              onClick={onClose}
              aria-label={t("closeMenu")}
              className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-6 pr-2 space-y-6">
          {user ? (
            <div className="space-y-4">
              <p className="text-left text-sm text-gray-800 leading-6">
                {t("greetingInline", {
                  nickname: user.nickname,
                  defaultValue: "{{nickname}}님 안녕하세요",
                })}
              </p>
            </div>
          ) : (
            <div className="text-left">
              {locale === "ko" ? (
                <p className="text-sm text-gray-800 leading-6">
                  서비스 이용을 위해{" "}
                  <Link
                    href={`/${locale}/login`}
                    className="underline underline-offset-4 decoration-1 text-primary-700 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
                    aria-label="로그인 페이지로 이동"
                  >
                    로그인
                  </Link>
                  이 필요합니다.
                </p>
              ) : (
                <p className="text-sm text-gray-800 leading-6">
                  To continue, please{" "}
                  <Link
                    href={`/${locale}/login`}
                    className="underline underline-offset-4 decoration-1 text-primary-700 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
                    aria-label="Go to login page"
                  >
                    log in
                  </Link>
                  .
                </p>
              )}
            </div>
          )}

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center gap-2 w-full text-left text-sm text-gray-700 hover:text-primary-700 hover:bg-white rounded-md px-3 py-2 transition"
            >
              <Home className="h-5 w-5 text-primary-800" />
              {t("home")}
            </button>
          </div>
        </div>

        {user && (
          <>
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-[#FAFAFA]">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                aria-expanded={profileOpen}
                aria-controls="profile-submenu"
                className="w-full flex items-center justify-between px-3 py-3 hover:bg-white transition text-sm"
              >
                <span className="flex items-center gap-2 text-gray-800">
                  <User className="h-5 w-5 text-primary-800" />
                  {t("profile", { defaultValue: "Profile" })}
                </span>
                {profileOpen ? (
                  <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500 transition-transform" />
                )}
              </button>

              <div
                id="profile-submenu"
                className="grid grid-cols-1"
                style={{
                  overflow: "hidden",
                  transition: "max-height 220ms ease",
                  maxHeight: profileOpen ? 320 : 0,
                }}
              >
                <button
                  onClick={() => handleNavigation("/profile/account")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition text-left"
                >
                  <UserCog className="h-4 w-4 text-primary-700" />
                  {t("account", { defaultValue: "Account" })}
                </button>
                <button
                  onClick={() => handleNavigation("/profile/favorites")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition text-left"
                >
                  <Heart className="h-4 w-4 text-primary-700" />
                  {t("favorites", { defaultValue: "Favorites" })}
                </button>
                <button
                  onClick={() => handleNavigation("/profile/reservations")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition text-left"
                >
                  <CalendarDays className="h-4 w-4 text-primary-700" />
                  {t("reservations", { defaultValue: "Reservations" })}
                </button>
                <button
                  onClick={() => handleNavigation("/profile/reviews")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition text-left"
                >
                  <MessageSquare className="h-4 w-4 text-primary-700" />
                  {t("reviews", { defaultValue: "Reviews" })}
                </button>
                <button
                  onClick={() => handleNavigation("/profile/settings")}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition text-left"
                >
                  <SettingsIcon className="h-4 w-4 text-primary-700" />
                  {t("settings", { defaultValue: "Settings" })}
                </button>
              </div>
            </div>

            {user.role === "ADMIN" && (
              <button
                onClick={() => handleNavigation("/admin")}
                className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-700 transition"
              >
                {t("adminPage")}
              </button>
            )}
          </>
        )}

        <div className="rounded-xl border border-gray-200 overflow-hidden bg-[#FAFAFA]">
          <button
            onClick={() => setSupportOpen((v) => !v)}
            aria-expanded={supportOpen}
            aria-controls="support-submenu"
            className="w-full flex items-center justify-between px-3 py-3 hover:bg-white transition text-sm"
          >
            <span className="flex items-center gap-2 text-gray-800">
              <HelpCircle className="h-5 w-5 text-primary-800" />
              {t("support", { defaultValue: "Support" })}
            </span>
            {supportOpen ? (
              <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500 transition-transform" />
            )}
          </button>

          <div
            id="support-submenu"
            className="grid grid-cols-1"
            style={{
              overflow: "hidden",
              transition: "max-height 220ms ease",
              maxHeight: supportOpen ? 160 : 0, // 항목 2개면 충분
            }}
          >
            <button
              onClick={() => handleNavigation("/help")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm transition text-left
                  ${
                    isActive("/help")
                      ? "bg-white text-primary-800"
                      : "text-gray-700 hover:bg-white hover:text-primary-800"
                  }`}
            >
              <HelpCircle className="h-4 w-4 text-primary-700" />
              {t("faq", { defaultValue: "FAQ" })}
            </button>
            <button
              onClick={() => handleNavigation("/help/contact")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm transition text-left
                  ${
                    isActive("/help/contact")
                      ? "bg-white text-primary-800"
                      : "text-gray-700 hover:bg-white hover:text-primary-800"
                  }`}
            >
              <Mail className="h-4 w-4 text-primary-700" />
              {t("contact", { defaultValue: "Contact" })}
            </button>
          </div>
        </div>

        {user && (
          <div className="shrink-0 border-t border-gray-200 p-4 pt-3">
            <button
              onClick={async () => {
                await onLogout();
                onClose();
              }}
              className="w-full bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            >
              {t("logout")}
            </button>
          </div>
        )}
      </aside>
    </>,
    document.body
  );
};

export default SideMenu;
