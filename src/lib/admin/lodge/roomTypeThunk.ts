import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";
import { RoomType } from "@/types/lodge";
import { RootState } from "@/lib/store/store";

export const fetchRoomTypes = createAsyncThunk<
  RoomType[],
  { lodgeId: number },
  { rejectValue: string; state: RootState }
>(
  "admin/fetchRoomTypes",
  async ({ lodgeId }, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${lodgeId}/room-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as RoomType[];
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to fetch room types");
    }
  }
);

export const createRoomType = createAsyncThunk<
  { message: string; roomType: RoomType },
  {
    lodgeId: number;
    name: string;
    description?: string | null;
    basePrice: number;
    maxAdults: number;
    maxChildren: number;
    totalRooms: number;
  },
  { rejectValue: string; state: RootState }
>(
  "admin/createRoomType",
  async (newRoomTypeData, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-type`,
        newRoomTypeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as { message: string; roomType: RoomType };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to create room type");
    }
  }
);

export const updateRoomType = createAsyncThunk<
  { message: string; roomType: RoomType },
  {
    id: number;
    name: string;
    description?: string | null;
    basePrice: number;
    maxAdults: number;
    maxChildren: number;
    totalRooms: number;
  },
  { rejectValue: string; state: RootState }
>(
  "admin/updateRoomType",
  async (payload, { dispatch, rejectWithValue, getState }) => {
    const { id, ...patch } = payload;
    try {
      const token = getState().auth.accessToken;
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-type/${id}`,
        patch,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as { message: string; roomType: RoomType };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to update room type");
    }
  }
);

export const deleteRoomType = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string; state: RootState }
>(
  "admin/deleteRoomType",
  async (roomTypeId, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-type/${roomTypeId}`,
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
      return rejectWithValue("Failed to delete room type");
    }
  }
);
