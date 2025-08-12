"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { loginUser } from "@/lib/auth/loginThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { socialLoginThunk } from "@/lib/auth/socialLoginThunk";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n/i18n";
import { setRedirectAfterLogin } from "@/lib/auth/authSlice";
import { isValidRedirectPath } from "@/utils/getRedirectPath";
import toast from "react-hot-toast";
import { useLoadingRouter } from "@/utils/useLoadingRouter";

const LoginPage = () => {
  const { t } = useTranslation("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const router = useLoadingRouter();
  const locale = useLocale();

  const redirectPath = useAppSelector((state) => state.auth.redirectAfterLogin);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const pending = localStorage.getItem("pendingReservation");

      if (pending) {
        const parsed = JSON.parse(pending);
        localStorage.removeItem("pendingReservation");

        if (parsed?.type === "ticket" && parsed.ticketId) {
          const { ticketId, date, adults, children } = parsed;
          const query = new URLSearchParams({
            date,
            adults: adults.toString(),
            children: children.toString(),
          });
          router.push(`/${locale}/ticket/${ticketId}?${query.toString()}`);
        } else if (parsed?.type === "lodge" && parsed.lodgeId) {
          const {
            lodgeId,
            roomTypeId,
            checkIn,
            checkOut,
            adults,
            children,
            roomCount,
            lodgeName,
            roomName,
          } = parsed;
          const query = new URLSearchParams({
            roomTypeId: roomTypeId ?? "",
            checkIn: checkIn ?? "",
            checkOut: checkOut ?? "",
            adults: (adults ?? 1).toString(),
            children: (children ?? 0).toString(),
            roomCount: (roomCount ?? 1).toString(),
            lodgeName: lodgeName ? encodeURIComponent(lodgeName) : "",
            roomName: roomName ? encodeURIComponent(roomName) : "",
          });
          router.push(`/${locale}/lodge/${lodgeId}?${query.toString()}`);
        } else {
          router.push(`/${locale}`);
        }

        dispatch(setRedirectAfterLogin(null));
        return;
      }

      if (redirectPath && isValidRedirectPath(`/${redirectPath}`)) {
        router.push(
          `/${locale}${
            redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`
          }`
        );
      } else {
        router.push(`/${locale}`);
      }

      dispatch(setRedirectAfterLogin(null));
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error(t("fillAllFields"));
    }

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      dispatch(showLoading());
      await dispatch(loginUser({ email, password })).unwrap();
      if (redirectPath) {
        const pending = localStorage.getItem("pendingReservation");
        if (pending) {
          const {
            lodgeId,
            roomTypeId,
            checkIn,
            checkOut,
            adults,
            children,
            roomCount,
            lodgeName,
            roomName,
          } = JSON.parse(pending);
          const query = new URLSearchParams({
            lodgeId,
            roomTypeId,
            checkIn,
            checkOut,
            adults: adults.toString(),
            children: children.toString(),
            roomCount: roomCount.toString(),
            lodgeName,
            roomName,
          }).toString();
          localStorage.removeItem("pendingReservation");
          router.push(`/${locale}/reservation?${query}`);
        } else {
          const isLocalePrefixed = redirectPath.startsWith(`/${locale}`);

          router.push(
            isLocalePrefixed
              ? redirectPath
              : `/${locale}${
                  redirectPath.startsWith("/")
                    ? redirectPath
                    : `/${redirectPath}`
                }`
          );
        }
        dispatch(setRedirectAfterLogin(null));
      } else {
        router.push(`/${locale}`);
      }
    } catch {
      toast.error(t("loginFailed"));
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    if (!credential) {
      toast.error(t("googleLoginFailed"));
      return;
    }
    try {
      dispatch(showLoading());
      await dispatch(
        socialLoginThunk({ provider: "google", accessToken: credential })
      );

      if (redirectPath) {
        const pending = localStorage.getItem("pendingReservation");

        if (pending) {
          const parsed = JSON.parse(pending);
          localStorage.removeItem("pendingReservation");

          if (parsed.type === "ticket") {
            const { ticketId, date, adults, children } = parsed;
            const query = new URLSearchParams({
              date,
              adults: adults.toString(),
              children: children.toString(),
            });
            router.push(`/${locale}/ticket/${ticketId}?${query.toString()}`);
          } else if (parsed.lodgeId) {
            const {
              lodgeId,
              roomTypeId,
              checkIn,
              checkOut,
              adults,
              children,
              roomCount,
              lodgeName,
              roomName,
            } = parsed;
            const query = new URLSearchParams({
              roomTypeId: roomTypeId ?? "",
              checkIn: checkIn ?? "",
              checkOut: checkOut ?? "",
              adults: (adults ?? "1").toString(),
              children: (children ?? "0").toString(),
              roomCount: (roomCount ?? "1").toString(),
              lodgeName: lodgeName ? encodeURIComponent(lodgeName) : "",
              roomName: roomName ? encodeURIComponent(roomName) : "",
            });

            router.push(`/${locale}/lodge/${lodgeId}?${query.toString()}`);
          } else {
            toast.error(t("loginFailed"));
          }
        } else {
          router.push(`/${locale}${redirectPath}`);
        }
        dispatch(setRedirectAfterLogin(null));
      }
    } catch {
      toast.error(t("googleLoginFailed"));
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Login failed:");
    toast.error(t("loginFailed"));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          {t("title")}
        </h1>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-900"
            >
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-900"
            >
              {t("password")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash text-lg"></i>
                ) : (
                  <i className="bi bi-eye text-lg"></i>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember-me"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              onChange={(e) => setRememberMe(e.target.checked)}
              checked={rememberMe}
            />
            <label
              htmlFor="remember-me"
              className="text-sm text-gray-700 font-medium"
            >
              {t("rememberMe")}
            </label>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-primary-600 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          >
            {t("login")}
          </button>

          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-600">
              {t("signupPrompt")}{" "}
              <a
                href={`/${locale}/signup/email`}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                {t("signupLink")}
              </a>
            </p>
            <p className="text-sm text-gray-600">
              {t("forgotPassword")}{" "}
              <a
                href={`/${locale}/reset-password`}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                {t("resetPassword")}
              </a>
            </p>
          </div>
        </div>

        <div className="relative">
          <hr className="border-gray-200" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-600 whitespace-nowrap">
            {t("orSignInWith")}
          </span>
        </div>

        <div className="flex justify-center gap-4">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-primary-600 text-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            disabled
          >
            <i className="bi bi-apple"></i>
          </button>
          <div className="flex items-center justify-center w-12 h-12">
            <GoogleLogin
              key={i18n.language}
              onSuccess={handleGoogleLogin}
              onError={handleGoogleLoginError}
              locale={i18n.language}
              size="large"
              shape="circle"
              text="continue_with"
            />
          </div>
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-primary-600 text-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            disabled
          >
            <i className="bi bi-facebook"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
