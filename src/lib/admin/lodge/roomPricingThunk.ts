import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";
import { RoomPricing } from "@/types/lodge";
import { RootState } from "@/lib/store/store";

export const fetchRoomPrice = createAsyncThunk<
  RoomPricing[],
  { roomTypeId: number; date?: string },
  { rejectValue: string; state: RootState }
>(
  "admin/fetchRoomPrice",
  async ({ roomTypeId, date }, { dispatch, rejectWithValue, getState }) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-pricing?roomTypeId=${roomTypeId}`;
      if (date) url += `&date=${encodeURIComponent(date)}`;

      const token = getState().auth.accessToken;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return res.data as RoomPricing[];
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to fetch room pricing");
    }
  }
);

export const createRoomPrice = createAsyncThunk<
  { message: string; roomPricing: RoomPricing },
  {
    roomTypeId: number;
    date: string;
    price: number;
    priceType: "WEEKDAY" | "WEEKEND" | "PEAK" | "OFF";
  },
  { rejectValue: string; state: RootState }
>(
  "admin/createRoomPrice",
  async (newRoomPriceData, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-pricing`,
        newRoomPriceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as { message: string; roomPricing: RoomPricing };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to create room price");
    }
  }
);

export const updateRoomPrice = createAsyncThunk<
  { message: string; updated: RoomPricing },
  {
    id: number;
    date?: string;
    price?: number;
    priceType?: "WEEKDAY" | "WEEKEND" | "PEAK" | "OFF";
  },
  { rejectValue: string; state: RootState }
>(
  "admin/updateRoomPrice",
  async ({ id, ...patchData }, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-pricing/${id}`,
        patchData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as { message: string; updated: RoomPricing };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to update room price");
    }
  }
);

export const deleteRoomPrice = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string; state: RootState }
>(
  "/admin/deleteRoomPrice",
  async (roomPricingId, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-pricing/${roomPricingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as { message: string };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to delete room price");
    }
  }
);
