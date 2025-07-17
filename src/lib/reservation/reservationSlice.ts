import { Reservation } from "@/types/reservation";
import { createSlice } from "@reduxjs/toolkit";
import {
  cancelReservation,
  createReservation,
  fetchReservation,
} from "./reservationThunk";

interface ReservationState {
  list: Reservation[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalCount: number;
  page: number;
}

const initialState: ReservationState = {
  list: [],
  loading: false,
  error: null,
  totalPages: 0,
  totalCount: 0,
  page: 1,
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.reservations;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createReservation.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (reservation) => reservation.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.unshift(action.payload);
        }
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const index = state.list.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default reservationSlice.reducer;
