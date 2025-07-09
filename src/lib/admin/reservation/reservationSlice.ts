import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reservation } from "@/types/reservation";
import { getAllReservations, getReservationById, updateReservationStatus } from "./reservationThunk";


interface AdminReservationState {
  list: Reservation[];
  selected: Reservation | null;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdminReservationState = {
  list: [],
  selected: null,
  state: "idle",
  error: null,
};

const adminReservationSlice = createSlice({
  name: "admin/reservation",
  initialState,
  reducers: {
    clearSelectedReservation(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllReservations.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(getAllReservations.fulfilled, (state, action: PayloadAction<Reservation[]>) => {
        state.state = "succeeded";
        state.list = action.payload;
      })
      .addCase(getAllReservations.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload ?? "Failed to fetch reservations";
      });

    builder
      .addCase(getReservationById.pending, (state) => {
        state.state = "loading";
        state.error = null;
        state.selected = null;
      })
      .addCase(getReservationById.fulfilled, (state, action: PayloadAction<Reservation>) => {
        state.state = "succeeded";
        state.selected = action.payload;
      })
      .addCase(getReservationById.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload ?? "Failed to fetch reservation";
      });

    builder
      .addCase(updateReservationStatus.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(updateReservationStatus.fulfilled, (state, action: PayloadAction<Reservation>) => {
        state.state = "succeeded";

        const updated = action.payload;
        const index = state.list.findIndex((r) => r.id === updated.id);
        if (index !== -1) {
          state.list[index] = updated;
        }
        if (state.selected?.id === updated.id) {
          state.selected = updated;
        }
      })
      .addCase(updateReservationStatus.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload ?? "Failed to update reservation";
      });
  },
});

export const { clearSelectedReservation } = adminReservationSlice.actions;
export default adminReservationSlice.reducer;
