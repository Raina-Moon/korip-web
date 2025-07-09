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
  { data: User[]; total: number; page: number; limit: number },
  { page?: number; limit?: number },
  { rejectValue: string; state: RootState }
>(
  "/admin/fetchAllUsers",
  async ({ page, limit }, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(showLoading());
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/user`,
        {
          params: {
            page,
            limit,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (!res.data || !Array.isArray(res.data.data)) {
        return rejectWithValue("Invalid server response");
      }

      return res.data;
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to fetch users");
    } finally {
      dispatch(hideLoading());
    }
  }
);

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
  { data: Reservation[]; total: number; page: number; limit: number },
  { userId: number; page: number; limit: number },
  { rejectValue: string; state: RootState }
>(
  "/admin/fetchUserReservations",
  async ({ userId, page, limit }, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(showLoading());
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/user/${userId}/reservations`,
        {
          params: {
            page,
            limit,
          },
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
  { data: Review[]; total: number; page: number; limit: number },
  { userId: number; page: number; limit: number },
  { rejectValue: string; state: RootState }
>(
  "/admin/fetchUserReviews",
  async ({ userId, page, limit }, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(showLoading());
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/user/${userId}/reviews`,
        {
          params: {
            page,
            limit,
          },
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
