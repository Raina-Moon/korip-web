import axios from "axios";
import { Reservation } from "@/types/reservation";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store/store";

export const getAllReservations = createAsyncThunk<
  Reservation[],
  void,
  { rejectValue: string; state: RootState }
>(
  `/admin/reservation`,
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reservation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch reservations");
    }
  }
);

export const getReservationById = createAsyncThunk<
  Reservation,
  number,
  { rejectValue: string; state: RootState }
>(
  `/admin/reservation/:id`,
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reservation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch reservation");
    }
  }
);

export const updateReservationStatus = createAsyncThunk<
  Reservation,
  { id: number; status: string; cancelReason?: string },
  { rejectValue: string; state: RootState }
>(
  `/admin/reservation/:id/`,
  async ({ id, status, cancelReason }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reservation/${id}`, {
        status,
        cancelReason,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update reservation status");
    }
  }
);


