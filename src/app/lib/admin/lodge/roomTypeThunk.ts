import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";

export interface RoomType {
  id: number;
  lodgeId: number;
  name: string;
  description: string | null;
  basePrice: number;
  maxAdults: number;
  maxChildren: number;
  totalRooms: number;
}

export const fetchRoomTypes = createAsyncThunk<
  RoomType[],
  { lodgeId: number },
  { rejectValue: string }
>(
  "admin/fetchRoomTypes",
  async ({ lodgeId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${lodgeId}/room-types`,
        {
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
  { rejectValue: string }
>(
  "admin/createRoomType",
  async (newRoomTypeData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-type`,
        newRoomTypeData,
        { withCredentials: true }
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
  { rejectValue: string }
>("admin/updateRoomType", async (payload, { dispatch, rejectWithValue }) => {
  const { id, ...patch } = payload;
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-type/${id}`,
      patch,
      { withCredentials: true }
    );
    return res.data as { message: string; roomType: RoomType };
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to update room type");
  }
});

export const deleteRoomType = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string }
>("admin/deleteRoomType", async (roomTypeId, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-type/${roomTypeId}`,
      { withCredentials: true }
    );
    return res.data as { message: string };
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to delete room type");
  }
});
