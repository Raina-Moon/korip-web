import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";
import { RoomInventory } from "@/types/lodge";

export const fetchRoomInventory = createAsyncThunk<
  RoomInventory[],
  { lodgeId: number; roomTypeId: number },
  { rejectValue: string }
>(
  "admin/fetchRoomInventory",
  async ({ lodgeId, roomTypeId }, { dispatch, rejectWithValue }) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-inventory`;
      const params: string[] = [];
      if (lodgeId !== undefined) params.push(`lodgeId=${lodgeId}`);
      if (roomTypeId !== undefined) params.push(`roomTypeId=${roomTypeId}`);
      if (params.length) url += `?${params.join("&")}`;

      const res = await axios.get(url, { withCredentials: true });
      return res.data as RoomInventory[];
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to fetch room inventory");
    }
  }
);

export const createRoomInventory = createAsyncThunk<
  { message: string; inventory: RoomInventory },
  {
    lodgeId: number;
    roomTypeId: number;
    date: string;
    availableRooms: number;
  },
  { rejectValue: string }
>(
  "admin/createRoomInventory",
  async (newInventoryData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-inventory`,
        newInventoryData,
        { withCredentials: true }
      );
      return res.data as { message: string; inventory: RoomInventory };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to create room inventory");
    }
  }
);

export const updateRoomInventory = createAsyncThunk<
  { message: string; inventory: RoomInventory },
  {
    id: number;
    date?: string;
    availableRooms?: number;
  },
  { rejectValue: string }
>(
  "admin/updateRoomInventory",
  async ({ id, ...patchData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-inventory/${id}`,
        patchData,
        { withCredentials: true }
      );
      return res.data as {
        message: string;
        inventory: RoomInventory;
      };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to update room inventory");
    }
  }
);

export const deleteRoomInventory = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string }
>(
  "admin/deleteRoomInventory",
  async (inventoryId, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/room-inventory/${inventoryId}`,
        { withCredentials: true }
      );
      return res.data as { message: string };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to delete room inventory");
    }
  }
);
