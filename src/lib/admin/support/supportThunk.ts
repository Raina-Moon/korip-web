import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/auth/authSlice";
import { Support, SupportPagination, SupportStatus } from "@/types/support";

export const fetchAllSupports = createAsyncThunk<
  SupportPagination,
  { page?: number; limit?: number },
  { rejectValue: string; state: RootState }
>(
  "admin/support/fetchList",
  async ({ page = 1, limit = 20 }, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/support`,
        {
          params: { page, pageSize: limit },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const { items, total, page: p, pageSize } = res.data;
      return { data: items as Support[], total, page: p, limit: pageSize };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      }
      return rejectWithValue("Failed to fetch supports");
    }
  }
);

export const patchSupport = createAsyncThunk<
  Support,
  { id: number; answer?: string; status?: SupportStatus },
  { rejectValue: string; state: RootState }
>(
  "admin/support/patch",
  async ({ id, answer, status }, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/support/${id}`,
        { answer, status },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      return res.data as Support;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      }
      return rejectWithValue("Failed to update support");
    }
  }
);
