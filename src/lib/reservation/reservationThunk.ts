import { Reservation } from "@/types/reservation";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store/store";

interface CreateReservationPayload {
  lodgeId: number;
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomCount: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  nationality: string;
  specialRequests?: string[];
}

export const fetchReservation = createAsyncThunk<
  {
    reservations: Reservation[];
    totalCount: number;
    totalPages: number;
    page: number;
  },
  { page: number; limit?: number; status?: string },
  { rejectValue: string; state: RootState }
>(
  "reservation/fetchReservation",
  async ({ page, limit = 10, status }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reservation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
            status: status ?? "ALL",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch {
      return rejectWithValue("Failed to fetch reservations");
    }
  }
);

export const createReservation = createAsyncThunk<
  Reservation,
  CreateReservationPayload,
  { rejectValue: string; state: RootState }
>(
  "reservation/createReservation",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reservation`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data as Reservation;
    } catch {
      return rejectWithValue("Failed to create reservation");
    }
  }
);

export const confirmReservation = createAsyncThunk<
  Reservation,
  { reservationId: number },
  { rejectValue: string; state: RootState }
>(
  "reservation/confirmReservation",
  async ({ reservationId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reservation/confirm`,
        { reservationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data as Reservation;
    } catch {
      return rejectWithValue("Failed to confirm reservation");
    }
  }
);

export const cancelReservation = createAsyncThunk<
  Reservation,
  { reservationId: number; cancelReason: string },
  { rejectValue: string; state: RootState }
>(
  "reservation/cancelReservation",
  async ({ reservationId, cancelReason }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reservation/${reservationId}/cancel`,
        { cancelReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data as Reservation;
    } catch {
      return rejectWithValue("Failed to cancel reservation");
    }
  }
);
