import axios from "axios";
import { TicketReservation } from "@/types/ticketReservation";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store/store";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";

export const getAllTicketReservations = createAsyncThunk<
  { data: TicketReservation[]; total: number; page: number; limit: number },
  { page?: number; limit?: number },
  { rejectValue: string; state: RootState }
>(
  `/admin/ticket-reservations`,
  async ({ page, limit }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(showLoading());
      const token = getState().auth.accessToken;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ticket-reservation`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch {
      return rejectWithValue("Failed to fetch ticket reservations");
    } finally {
      dispatch(hideLoading());
    }
  }
);

export const getTicketReservationById = createAsyncThunk<
  TicketReservation,
  number,
  { rejectValue: string; state: RootState }
>(
  `/admin/ticket-reservations/:id`,
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ticket-reservation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch {
      return rejectWithValue("Failed to fetch ticket reservation");
    }
  }
);

export const updateTicketReservationStatus = createAsyncThunk<
  TicketReservation,
  { id: number; status: string; cancelReason?: string },
  { rejectValue: string; state: RootState }
>(
  `/admin/ticket-reservations/:id/`,
  async (
    { id, status, cancelReason },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      dispatch(showLoading());
      const token = getState().auth.accessToken;
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ticket-reservation/${id}`,
        {
          status,
          cancelReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch {
      return rejectWithValue("Failed to update ticket reservation status");
    } finally {
      dispatch(hideLoading());
    }
  }
);
