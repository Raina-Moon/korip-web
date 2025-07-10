"use client";

import React, { useState } from "react";
import {
  useUpdateUserNicknameMutation,
  useDeleteUserMutation,
} from "@/lib/user/userApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout, updateNickname } from "@/lib/auth/authSlice";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const [nickname, setNickname] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

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
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.data?.message || "Failed to update nickname.");
    }
  };

  const handleDeleteAccount = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteUser().unwrap();
      setSuccessMessage("Your account has been deleted.");
      dispatch(logout());
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.data?.message || "Failed to delete account.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">My Account</h1>

      <section className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Change Nickname</h2>
        <form onSubmit={handleNicknameSubmit} className="space-y-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter new nickname"
            className="border rounded px-3 py-2 w-full"
            disabled={isUpdating}
          />
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Nickname"}
          </button>
        </form>
      </section>

      <section className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h2>
        <p className="mb-3 text-sm text-gray-600">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete My Account"}
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
