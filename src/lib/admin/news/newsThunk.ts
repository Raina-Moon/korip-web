import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/auth/authSlice";
import { News } from "@/types/news";

export interface NewsPagination {
  data: News[];
  total: number;
  page: number;
  limit: number;
}

export const fetchAllNews = createAsyncThunk<
  NewsPagination,
  { page?: number; limit?: number },
  { rejectValue: string; state: RootState }
>("news/fetchList", async ({ page = 1, limit = 10 }, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/news`,
      {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data as NewsPagination;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
    }
    return rejectWithValue("Failed to fetch news");
  }
});

export const fetchNewsById = createAsyncThunk<
  News,
  number,
  { rejectValue: string; state: RootState }
>("news/fetchById", async (id, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/news/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
    }
    return rejectWithValue("Failed to fetch news");
  }
});

export const createNewsThunk = createAsyncThunk<
  News,
  { title: string; content: string },
  { rejectValue: string; state: RootState }
>("news/create", async (data, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/news`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
    }
    return rejectWithValue("Failed to create news");
  }
});

export const updateNewsThunk = createAsyncThunk<
  News,
  { id: number; data: { title: string; content: string } },
  { rejectValue: string; state: RootState }
>(
  "news/update",
  async ({ id, data }, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/news/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      }
      return rejectWithValue("Failed to update news");
    }
  }
);

export const deleteNewsThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: RootState }
>("news/delete", async (id, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/news/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return id;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
    }
    return rejectWithValue("Failed to delete news");
  }
});
