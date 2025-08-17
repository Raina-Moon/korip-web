"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { Home } from "lucide-react";

type User = {
  nickname: string;
  role?: "ADMIN" | "USER" | string;
  email?: string;
} | null;

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
  user?: User;
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
  const menuRef = useRef<HTMLElement>(null);

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

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[998] bg-black/50 transition-opacity duration-300 ${
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
          bg-white/95 backdrop-saturate-150 shadow-2xl border-l border-gray-200 
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
          <h2 className="text-base font-semibold text-gray-900">
            {user ? t("menuTitle") : t("welcomeTitle")}
          </h2>
          <button
            onClick={onClose}
            aria-label={t("closeMenu")}
            className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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

        <div className="flex-1 overflow-y-auto pt-6 pr-2 space-y-6">
          {user ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-800">
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="underline text-primary-700 font-medium"
                  aria-label="Go to profile"
                >
                  {user.nickname}
                </button>
                <span className="ml-1">님 안녕하세요</span>
              </p>

              <button
                onClick={() => handleNavigation("/profile")}
                className="w-full border border-primary-600 text-primary-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-50 transition"
              >
                {t("profilePage")}
              </button>

              {user.role === "ADMIN" && (
                <button
                  onClick={() => handleNavigation("/admin")}
                  className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-700 transition"
                >
                  {t("adminPage")}
                </button>
              )}

              <button
                onClick={async () => {
                  await onLogout();
                  onClose();
                }}
                className="w-full bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 transition"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm text-gray-700">{t("pleaseLogin")}</p>
              <button
                onClick={() => handleNavigation("/login")}
                className="text-primary-700 underline font-medium"
              >
                {t("login")}
              </button>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={() => handleNavigation("/")}
              className="block w-full text-left text-sm text-gray-700 hover:text-primary-700"
            >
              <Home className="inline-block text-primary-800 mr-2" />
              {t("home")}
            </button>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default SideMenu;
