"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { loginUser } from "@/lib/auth/loginThunk";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { socialLoginThunk } from "@/lib/auth/socialLoginThunk";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n/i18n";
import { setRedirectAfterLogin } from "@/lib/auth/authSlice";
import { isValidRedirectPath } from "@/utils/getRedirectPath";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { t } = useTranslation("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
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
          router.push(`/${locale}${redirectPath}`);
        }
        dispatch(setRedirectAfterLogin(null));
      } else {
        router.push(`/${locale}`);
      }
    } catch (err) {
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
    } catch (err) {
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
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-primary-800 text-sm font-medium">{t("email")}</p>
        <input
          type="email"
          className="border border-primary-800 rounded-md outline-none px-3 py-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-primary-800 text-sm font-medium">{t("password")}</p>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-primary-800 rounded-md outline-none px-3 py-1"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary-700 hover:underline"
          >
            {showPassword ? (
              <i className="bi bi-eye-slash"></i>
            ) : (
              <i className="bi bi-eye"></i>
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          id="remember-me"
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          onChange={(e) => setRememberMe(e.target.checked)}
          checked={rememberMe}
        />
        <label htmlFor="remember-me" className="text-primary-800 text-sm">
          {t("rememberMe")}
        </label>
      </div>

      <button
        onClick={handleLogin}
        className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
      >
        {t("login")}
      </button>
      <div className="flex flex-col gap-2">
        <p className="text-primary-800 text-sm">
          {t("signupPrompt")}{" "}
          <a
            href={`/${locale}/signup/email`}
            className="text-primary-700 hover:underline"
          >
            {t("signupLink")}
          </a>
        </p>
        <p className="text-primary-800 text-sm">
          {t("forgotPassword")}{" "}
          <a
            href={`/${locale}/reset-password`}
            className="text-primary-700 hover:underline"
          >
            {t("resetPassword")}
          </a>
        </p>
      </div>

      <h2 className="text-2xl text-primary-800">{t("socialLogin")}</h2>
      <div className="flex flex-row gap-6">
        <button className="text-primary-700 text-4xl hover:text-primary-500">
          <i className="bi bi-apple"></i>
        </button>
        <GoogleLogin
          key={i18n.language}
          onSuccess={handleGoogleLogin}
          onError={handleGoogleLoginError}
          locale={i18n.language}
        />
        <button className="text-primary-700 text-4xl hover:text-primary-500">
          <i className="bi bi-facebook"></i>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
