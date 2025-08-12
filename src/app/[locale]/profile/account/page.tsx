"use client";

import React, { useState } from "react";
import {
  useUpdateUserNicknameMutation,
  useDeleteUserMutation,
} from "@/lib/user/userApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout, updateNickname } from "@/lib/auth/authSlice";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import { showConfirm } from "@/utils/showConfirm";
import toast from "react-hot-toast";

const AccountPage = () => {
  const { t } = useTranslation("account");
  const [nickname, setNickname] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const [updateNicknameMutation, { isLoading: isUpdating }] =
    useUpdateUserNicknameMutation();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setErrorMessage(t("nicknameError"));
      return;
    }

    if (trimmedNickname.length < 4) {
      setErrorMessage(t("nicknameLengthError"));
      return;
    }

    try {
      await updateNicknameMutation(trimmedNickname).unwrap();
      dispatch(updateNickname(trimmedNickname));
      toast.success(t("nicknameUpdated"));
      setSuccessMessage(t("nicknameUpdated"));
      setNickname("");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as any).data === "object" &&
        (err as any).data !== null &&
        "message" in (err as any).data
      ) {
        setErrorMessage(
          (err as { data: { message?: string } }).data.message ||
            t("nicknameUpdateFailed")
        );
      } else {
        setErrorMessage(t("nicknameUpdateFailed"));
      }
    }
  };

  const handleDeleteAccount = async () => {
    showConfirm({
      message: t("deleteConfirm"),
      confirmLabel: t("delete.yes"),
      cancelLabel: t("delete.no"),
      onConfirm: async () => {
        try {
          await deleteUser({}).unwrap();
          setSuccessMessage(t("deleted"));
          dispatch(logout());
          router.push(`/${locale}/`);
        } catch (err: unknown) {
          if (
            typeof err === "object" &&
            err !== null &&
            "data" in err &&
            typeof (err as any).data === "object" &&
            (err as any).data !== null &&
            "message" in (err as any).data
          ) {
            setErrorMessage(
              (err as { data: { message?: string } }).data.message ||
                t("deleteFailed")
            );
          } else {
            setErrorMessage(t("deleteFailed"));
          }
        }
      },
      onCancel: () => {},
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center sm:text-left">
          {t("title")}
        </h1>

        <div className="mt-4" aria-live="polite">
          {successMessage && (
            <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm sm:text-base">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm sm:text-base">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <section className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold text-primary-700">
              {t("changeNickname")}
            </h2>
            <form
              onSubmit={handleNicknameSubmit}
              className="mt-4 space-y-3 sm:space-y-4"
            >
              <div>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t("nicknamePlaceholder")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 sm:px-4 sm:py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  disabled={isUpdating}
                  inputMode="text"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full rounded-lg bg-primary-600 text-white py-3 sm:py-3.5 text-sm sm:text-base font-medium transition-all hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? t("updating") : t("updateNickname")}
              </button>
            </form>
          </section>

          <section className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold text-red-600">
              {t("dangerZone")}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {t("deleteWarning")}
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="mt-4 w-full rounded-lg bg-red-600 text-white py-3 sm:py-3.5 text-sm sm:text-base font-medium transition-all hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? t("deleting") : t("deleteAccount")}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
