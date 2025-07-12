import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TicketReservation } from "@/types/ticketReservation";
import {
  getAllTicketReservations,
  getTicketReservationById,
  updateTicketReservationStatus,
} from "./ticketReservationThunk";

interface AdminTicketReservationState {
  list: TicketReservation[];
  total: number;
  page: number;
  limit: number;
  selected: TicketReservation | null;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdminTicketReservationState = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  selected: null,
  state: "idle",
  error: null,
};

const adminTicketReservationSlice = createSlice({
  name: "admin/ticketReservation",
  initialState,
  reducers: {
    clearSelectedTicketReservation(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTicketReservations.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        getAllTicketReservations.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: TicketReservation[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.state = "succeeded";
          state.list = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getAllTicketReservations.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload ?? "Failed to fetch ticket reservations";
      });

    builder
      .addCase(getTicketReservationById.pending, (state) => {
        state.state = "loading";
        state.error = null;
        state.selected = null;
      })
      .addCase(
        getTicketReservationById.fulfilled,
        (state, action: PayloadAction<TicketReservation>) => {
          state.state = "succeeded";
          state.selected = action.payload;
        }
      )
      .addCase(getTicketReservationById.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload ?? "Failed to fetch ticket reservation";
      });

    builder
      .addCase(updateTicketReservationStatus.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        updateTicketReservationStatus.fulfilled,
        (state, action: PayloadAction<TicketReservation>) => {
          state.state = "succeeded";

          const updated = action.payload;
          const index = state.list.findIndex((r) => r.id === updated.id);
          if (index !== -1) {
            state.list[index] = updated;
          }
          if (state.selected?.id === updated.id) {
            state.selected = updated;
          }
        }
      )
      .addCase(updateTicketReservationStatus.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload ?? "Failed to update ticket reservation";
      });
  },
});

export const { clearSelectedTicketReservation } = adminTicketReservationSlice.actions;
export default adminTicketReservationSlice.reducer;
