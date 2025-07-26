"use client";

import {
  updatePassword,
  verifyCode,
} from "@/lib/reset-password/resetPasswordThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

const VerifyandResetPage = () => {
  const { t } = useTranslation("verif-reset");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const { error, remainingAttempts, attemptsExceeded } = useAppSelector(
    (state) => state.resetPassword
  );

  const params = useSearchParams();
  const email = params.get("email") || "";
  const router = useRouter();
  const dispatch = useAppDispatch();

  const locale = useLocale();

  useEffect(() => {
    setPasswordMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleCodeChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    if (val && i < 6) {
      document.getElementById(`code=${i + 1}`)?.focus();
    }
    setCode(next);
  };

  const handleVerify = async () => {
    const joinedCode = code.join("");
    const result = await dispatch(verifyCode({ email, code: joinedCode }));

    dispatch(hideLoading());

    if (verifyCode.fulfilled.match(result)) {
      setIsCodeValid(true);
      alert("Code verified successfully. You can now reset your password.");
    }

    setCode(["", "", "", "", "", ""]);
  };

  const handleUpdatePassword = async () => {
    dispatch(showLoading());
    const result = await dispatch(updatePassword({ email, newPassword }));
    dispatch(hideLoading());

    if (updatePassword.fulfilled.match(result)) {
      alert(t("password_updated"));
      router.push(`/${locale}/login`);
    } else {
      alert(result.payload || t("error_generic"));
    }
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;
  const passwordValid = passwordRegex.test(newPassword);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
          <Trans
            i18nKey="subtitle"
            ns="verif-reset"
            values={{ email }}
            components={{
              email: <span className="font-mono font-bold text-primary-700" />,
            }}
          />
        </h2>

        <div className="flex justify-center gap-2 mb-4">
          {code.map((digit, idx) => (
            <input
              type="text"
              key={idx}
              id={`code=${idx}`}
              maxLength={1}
              value={digit}
              disabled={attemptsExceeded || isCodeValid}
              onChange={(e) => handleCodeChange(idx, e.target.value)}
              className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          ))}
        </div>

        <div className="flex justify-center mb-4">
          <button
            className="bg-primary-700 text-white px-2 py-1 rounded-md hover:bg-primary-500"
            onClick={handleVerify}
            disabled={attemptsExceeded || isCodeValid}
          >
            {t("verify_btn")}
          </button>
        </div>

        {remainingAttempts !== null && !attemptsExceeded && (
          <p className="text-sm text-center text-gray-600 mb-2">
            {t("attempts_remaining", { count: remainingAttempts })}
          </p>
        )}
      </div>

      {attemptsExceeded && (
        <p className="text-red-600 text-sm text-center mt-2">
          {t("attempts_exceeded")}
          <a
            href={`/${locale}/reset-password`}
            className="underline text-primary-600"
          >
            {t("request_new_code")}
          </a>
          .
        </p>
      )}

      <div className="space-y-4 pt-2 w-full max-w-md ml-10">
        <label className="block text-gray-700 mb-1">
          {t("new_password_label")}
        </label>
        <input
          type="password"
          value={newPassword}
          disabled={!isCodeValid}
          placeholder={
            isCodeValid ? t("password_placeholder") : t("verify_code_first")
          }
          className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary-500 ${
            !passwordValid && newPassword.length > 0
              ? "border-red-700"
              : "border-gray-300"
          }`}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {newPassword.length > 0 && !passwordValid && (
          <p className="text-red-700 text-sm mt-1">{t("password_rule")}</p>
        )}

        <label className="block text-gray-700 mb-1">
          {t("confirm_password_label")}
        </label>
        <input
          type="password"
          value={confirmPassword}
          disabled={!isCodeValid}
          placeholder={
            isCodeValid
              ? t("confirm_password_placeholder")
              : t("verify_code_first")
          }
          className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary-500 ${
            confirmPassword.length > 0 && !passwordMatch
              ? "border-red-700"
              : "border-gray-300"
          }`}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPassword.length > 0 && !passwordMatch && (
          <p className="text-red-700 text-sm mt-1">{t("password_mismatch")}</p>
        )}

        <button
          type="button"
          disabled={!isCodeValid}
          onClick={handleUpdatePassword}
          className="w-full bg-primary-700 hover:bg-primary-500 text-white px-4 py-2 rounded-md"
        >
          {t("change_password_btn")}
        </button>
      </div>
    </div>
  );
};

export default VerifyandResetPage;
