import { TicketReservation } from "@/types/ticketReservation";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store/store";

interface CreateTicketReservationPayload {
  ticketTypeId: number;
  date: string;
  adults: number;
  children: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  nationality: string;
  specialRequests?: string[];
}

export const fetchTicketReservations = createAsyncThunk<
  {
    reservations: TicketReservation[];
    totalCount: number;
    page: number;
    totalPages: number;
  },
  { page: number; limit?: number },
  { rejectValue: string; state: RootState }
>(
  "ticketReservation/fetchTicketReservations",
  async ({ page, limit = 10 }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/ticket-reservation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data as {
        reservations: TicketReservation[];
        totalCount: number;
        page: number;
        totalPages: number;
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch ticket reservations");
    }
  }
);

export const createTicketReservation = createAsyncThunk<
  TicketReservation,
  CreateTicketReservationPayload,
  { rejectValue: string; state: RootState }
>(
  "ticketReservation/createTicketReservation",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/ticket-reservation`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data as TicketReservation;
    } catch (error) {
      return rejectWithValue("Failed to create ticket reservation");
    }
  }
);

export const confirmTicketReservation = createAsyncThunk<
  TicketReservation,
  { reservationId: number },
  { rejectValue: string; state: RootState }
>(
  "ticketReservation/confirmTicketReservation",
  async ({ reservationId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/ticket-reservation/confirm`,
        { reservationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data as TicketReservation;
    } catch (error) {
      return rejectWithValue("Failed to confirm ticket reservation");
    }
  }
);

export const cancelTicketReservation = createAsyncThunk<
  TicketReservation,
  { reservationId: number; cancelReason: string },
  { rejectValue: string; state: RootState }
>(
  "ticketReservation/cancelTicketReservation",
  async ({ reservationId, cancelReason }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/ticket-reservation/${reservationId}/cancel`,
        { cancelReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data as TicketReservation;
    } catch (error) {
      return rejectWithValue("Failed to cancel ticket reservation");
    }
  }
);
