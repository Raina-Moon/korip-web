
"use client";
export const runtime = 'edge';

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

    if (!nickname.trim()) {
      setErrorMessage("Please enter a nickname.");
      return;
    }

    try {
      await updateNicknameMutation(nickname).unwrap();
      dispatch(updateNickname(nickname));
      setSuccessMessage("Nickname updated successfully!");
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
    <div className="max-w-lg mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <section className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">{t("changeNickname")}</h2>
        <form onSubmit={handleNicknameSubmit} className="space-y-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t("nicknamePlaceholder")}
            className="border rounded px-3 py-2 w-full"
            disabled={isUpdating}
          />
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? t("updating") : t("updateNickname")}
          </button>
        </form>
      </section>

      <section className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2 text-red-600">
          {t("dangerZone")}
        </h2>
        <p className="mb-3 text-sm text-gray-600">{t("deleteWarning")}</p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? t("deleting") : t("deleteAccount")}
        </button>
      </section>

      {(successMessage || errorMessage) && (
        <div
          className={`p-3 rounded ${
            successMessage
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {successMessage || errorMessage}
        </div>
      )}
    </div>
  );
};

export default AccountPage;