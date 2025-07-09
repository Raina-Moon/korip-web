import axios from "axios";
import { RootState } from "../../store/store";
import { logout } from "../../auth/authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
  createdAt: string;
}

export const fetchAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string; state: RootState }
>("/admin/fetchAllUsers", async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to fetch users");
  }
});

export const deleteUser = createAsyncThunk<
  { message: string; user: User },
  number,
  { rejectValue: string; state: RootState }
>(
  "/admin/deleteUser",
  async (userId: number, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to delete user");
    }
  }
);

export const updateUserRole = createAsyncThunk<
  { message: string; user: User },
  { userId: number; role: "USER" | "ADMIN" },
  { rejectValue: string; state: RootState }
>(
  "/admin/updateUserRole",
  async ({ userId, role }, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/user/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to update user role");
    }
  }
);
