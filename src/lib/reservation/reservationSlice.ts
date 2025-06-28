import { Reservation } from "@/types/reservation";
import { createSlice } from "@reduxjs/toolkit";
import { createReservation, fetchReservation } from "./reservationThunk";

interface ReservationState {
  list: Reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  list: [],
  loading: false,
  error: null,
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
        state.list = action.payload;
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
      });
  },
});

export default reservationSlice.reducer;
