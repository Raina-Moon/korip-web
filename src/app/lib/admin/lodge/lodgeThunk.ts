import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";

export interface Lodge {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  accommodationType: string;
}

export interface RoomType {
  name: string;
  description: string | null;
  basePrice: number;
  maxAdults: number;
  maxChildren: number;
  totalRooms: number;
  roomPricing: {
    date: string;
    price: number;
    priceType: "WEEKDAY" | "WEEKEND" | "PEAK" | "OFF";
  }[];
}

export const fetchLodges = createAsyncThunk<
  Lodge[],
  void,
  { rejectValue: string }
>("admin/fetchLodges", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge`,
      {
        withCredentials: true,
      }
    );
    return res.data as Lodge[];
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to fetch lodges");
  }
});

export const createLodge = createAsyncThunk<
  { message: string; lodge: Lodge },
  {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    description?: string | null;
    accommodationType: string;
    roomTypes: {
      name: string;
      description: string | null;
      basePrice: number;
      maxAdults: number;
      maxChildren: number;
      totalRooms: number;
      roomPricing: {
        date: string;
        price: number;
        priceType: "WEEKDAY" | "WEEKEND" | "PEAK" | "OFF";
      }[];
    }[];
  },
  { rejectValue: string }
>("admin/createLodge", async (newLodgeData, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge`,
      newLodgeData,
      { withCredentials: true }
    );
    return res.data as { message: string; lodge: Lodge };
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to create lodge");
  }
});

export const fetchLodgeById = createAsyncThunk<
  Lodge,
  number,
  { rejectValue: string }
>("admin/fetchLodgeById", async (lodgeId, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${lodgeId}`,
      { withCredentials: true }
    );
    return res.data as Lodge;
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to fetch lodge by ID");
  }
});

export const updateLodge = createAsyncThunk<
  { message: string; lodge: Lodge },
  {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    description?: string | null;
    accommodationType: string;
  },
  { rejectValue: string }
>(
  "admin/updateLodge",
  async (updatedLodgeData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${updatedLodgeData.id}`,
        updatedLodgeData,
        { withCredentials: true }
      );
      return res.data as { message: string; lodge: Lodge };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to update lodge");
    }
  }
);

export const deleteLodge = createAsyncThunk<
  { message: string; lodge: Lodge },
  number,
  { rejectValue: string }
>(
  "admin/deleteLodge",
  async (lodgeId: number, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${lodgeId}`,
        { withCredentials: true }
      );
      return res.data as { message: string; lodge: Lodge };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to delete lodge");
    }
  }
);
