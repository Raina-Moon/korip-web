import axios from "axios";
import { RootState } from "../../store/store";
import { logout } from "../../auth/authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { Reservation } from "@/types/reservation";
import { Review } from "@/types/reivew";

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
    dispatch(showLoading())
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
  } finally {
    dispatch(hideLoading());
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
      dispatch(showLoading());
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
    } finally {
      dispatch(hideLoading());
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

export const fetchUserReservations = createAsyncThunk<
  Reservation[],
  number,
  { rejectValue: string; state: RootState }
>(
  "/admin/fetchUserReservations",
  async (userId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(showLoading());
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/user/${userId}/reservations`,
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
      return rejectWithValue("Failed to fetch user reservations");
    } finally {
      dispatch(hideLoading());
    }
  }
);

export const fetchUserReviews = createAsyncThunk<
  Review[],
  number,
  { rejectValue: string; state: RootState }
>(
  "/admin/fetchUserReviews",
  async (userId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(showLoading());
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/user/${userId}/reviews`,
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
      return rejectWithValue("Failed to fetch user reviews");
    } finally {
      dispatch(hideLoading());
    }
  }
);
