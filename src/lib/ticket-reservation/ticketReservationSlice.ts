import { TicketReservation } from "@/types/ticketReservation";
import { createSlice } from "@reduxjs/toolkit";
import {
  cancelTicketReservation,
  createTicketReservation,
  fetchTicketReservations,
} from "./ticketReservationThunk";

interface TicketReservationState {
  list: TicketReservation[];
  loading: boolean;
  error: string | null;
}

const initialState: TicketReservationState = {
  list: [],
  loading: false,
  error: null,
};

const ticketReservationSlice = createSlice({
  name: "ticketReservation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTicketReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createTicketReservation.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (reservation) => reservation.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.unshift(action.payload);
        }
      })
      .addCase(cancelTicketReservation.fulfilled, (state, action) => {
        const index = state.list.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default ticketReservationSlice.reducer;
