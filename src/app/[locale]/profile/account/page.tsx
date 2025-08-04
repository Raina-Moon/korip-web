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
            "Failed to update nickname."
        );
      } else {
        setErrorMessage("Failed to update nickname.");
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          {t("title")}
        </h1>

        <section className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md">
          <h2 className="text-xl font-semibold text-primary-700">
            {t("changeNickname")}
          </h2>
          <form onSubmit={handleNicknameSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t("nicknamePlaceholder")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                disabled={isUpdating}
              />
              {errorMessage && (
                <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? t("updating") : t("updateNickname")}
            </button>
          </form>
        </section>

        <section className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md">
          <h2 className="text-xl font-semibold text-red-600">
            {t("dangerZone")}
          </h2>
          <p className="text-sm text-gray-600">{t("deleteWarning")}</p>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? t("deleting") : t("deleteAccount")}
          </button>
        </section>
      </div>
    </div>
  );
};

export default AccountPage;
