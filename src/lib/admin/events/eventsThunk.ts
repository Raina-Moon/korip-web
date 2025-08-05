import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/auth/authSlice";
import { Event } from "@/types/events";

export interface EventPagination {
  data: Event[];
  total: number;
  page: number;
  limit: number;
}

export const fetchEvents = createAsyncThunk<
  EventPagination,
  { page?: number; limit?: number },
  { rejectValue: string; state: RootState }
>("admin/events/fetchAll", async ({ page = 1, limit = 10 }, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/events`,
      {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status || 0)) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to fetch events");
  }
});

export const fetchEventById = createAsyncThunk<
  Event,
  number,
  { rejectValue: string; state: RootState }
>("admin/events/fetchById", async (id, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/events/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status || 0)) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to fetch event");
  }
});

export const createEventThunk = createAsyncThunk<
  Event,
  { title: string; content: string },
  { rejectValue: string; state: RootState }
>("admin/events/create", async (data, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/events`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status || 0)) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to create event");
  }
});

export const updateEventThunk = createAsyncThunk<
  Event,
  { id: number; data: { title: string; content: string } },
  { rejectValue: string; state: RootState }
>("admin/events/update", async ({ id, data }, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/events/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status || 0)) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to update event");
  }
});

export const deleteEventThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: RootState }
>("admin/events/delete", async (id, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return id;
  } catch (err: any) {
    if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status || 0)) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to delete event");
  }
});
