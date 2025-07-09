"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchAllUsers, deleteUser, updateUserRole } from "@/lib/admin/user/adminUserThunk";
import { AppDispatch, RootState } from "@/lib/store/store";

export default function AdminUsersPage() {
  const dispatch: AppDispatch = useAppDispatch();

  const { list, state, error } = useAppSelector(
    (state: RootState) => state["admin/user"]
  );

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - User Management</h1>

      {state === "loading" && (
        <div className="text-gray-500">Loading users...</div>
      )}
      {state === "failed" && <div className="text-red-500">Error: {error}</div>}

      {state === "succeeded" && list.length === 0 && (
        <div className="text-gray-500">No users found.</div>
      )}

      {state === "succeeded" && list.length > 0 && (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Nickname</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{user.id}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.nickname}</td>
                <td className="p-2 border text-center">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      dispatch(
                        updateUserRole({
                          userId: user.id,
                          role: e.target.value as "USER" | "ADMIN",
                        })
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="p-2 border text-center">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
