import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createRoomPrice,
  deleteRoomPrice,
  fetchRoomPrice,
  RoomPricing,
  updateRoomPrice,
} from "./roomPricingThunk";

interface RoomPricingState {
  list: RoomPricing[];
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RoomPricingState = {
  list: [],
  state: "idle",
  error: null,
};

const roomPricingSlice = createSlice({
  name: "admin/roomPricing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomPrice.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        fetchRoomPrice.fulfilled,
        (state, action: PayloadAction<RoomPricing[]>) => {
          state.state = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(fetchRoomPrice.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(createRoomPrice.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        createRoomPrice.fulfilled,
        (
          state,
          action: PayloadAction<{ message: string; roomPricing: RoomPricing }>
        ) => {
          state.state = "succeeded";
          state.list.push(action.payload.roomPricing);
        }
      )
      .addCase(createRoomPrice.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(updateRoomPrice.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        updateRoomPrice.fulfilled,
        (
          state,
          action: PayloadAction<{ message: string; updated: RoomPricing }>
        ) => {
          state.state = "succeeded";
          const updatedPricing = action.payload.updated;
          const index = state.list.findIndex(
            (pricing) => pricing.id === updatedPricing.id
          );
          if (index !== -1) {
            state.list[index] = updatedPricing;
          }
        }
      )
      .addCase(updateRoomPrice.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteRoomPrice.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(deleteRoomPrice.fulfilled, (state, action) => {
        state.state = "succeeded";
        const deletedId = action.meta.arg as number;
        state.list = state.list.filter((pricing) => pricing.id !== deletedId);
      })
      .addCase(deleteRoomPrice.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });
  },
});

export default roomPricingSlice.reducer;
