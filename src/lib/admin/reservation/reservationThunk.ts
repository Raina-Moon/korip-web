import axios from "axios";
import { Reservation } from "@/types/reservation";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store/store";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";

export const getAllReservations = createAsyncThunk<
  {data:Reservation[]; total:number;page:number;limit:number},
  {page?: number; limit?: number},
  { rejectValue: string; state: RootState }
>(
  `/admin/reservation`,
  async ({page, limit}, { rejectWithValue, getState,dispatch }) => {
    try {
      dispatch(showLoading())
      const token = getState().auth.accessToken;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reservation`, {
        params: {
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch reservations");
    } finally {
      dispatch(hideLoading());
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
  async ({ id, status, cancelReason }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(showLoading());
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
    } finally {
      dispatch(hideLoading());
    }
  }
);


