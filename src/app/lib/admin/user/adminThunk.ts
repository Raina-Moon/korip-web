import axios from "axios";
import { AppDispatch } from "../../store/store";
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
  { rejectValue: string }
>("/admin/fetchAllUsers", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/users`,
      {
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
  { rejectValue: string }
>(
  "/admin/deleteUser",
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/users/${userId}`,
        {
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
