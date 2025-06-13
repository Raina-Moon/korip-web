import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createRoomInventory,
  deleteRoomInventory,
  fetchRoomInventory,
  RoomInventory,
  updateRoomInventory,
} from "./roomInventoryThunk";

interface RoomInventoryState {
  list: RoomInventory[];
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RoomInventoryState = {
  list: [],
  state: "idle",
  error: null,
};

const roomInventorySlice = createSlice({
  name: "admin/roomInventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomInventory.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        fetchRoomInventory.fulfilled,
        (state, action: PayloadAction<RoomInventory[]>) => {
          state.state = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(fetchRoomInventory.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(createRoomInventory.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        createRoomInventory.fulfilled,
        (
          state,
          action: PayloadAction<{ message: string; inventory: RoomInventory }>
        ) => {
          state.state = "succeeded";
          state.list.push(action.payload.inventory);
        }
      )
      .addCase(createRoomInventory.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(updateRoomInventory.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        updateRoomInventory.fulfilled,
        (
          state,
          action: PayloadAction<{
            message: string;
            inventory: RoomInventory;
          }>
        ) => {
          state.state = "succeeded";
          const updatedInventory = action.payload.inventory;
          const idx = state.list.findIndex(
            (inv) => inv.id === updatedInventory.id
          );

          if (idx !== -1) {
            state.list[idx] = updatedInventory;
          }
        }
      )
      .addCase(updateRoomInventory.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteRoomInventory.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(deleteRoomInventory.fulfilled, (state, action) => {
        state.state = "succeeded";
        const deletedId = action.meta.arg as number;
        state.list = state.list.filter((inv) => inv.id !== deletedId);
      })
      .addCase(deleteRoomInventory.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });
  },
});

export default roomInventorySlice.reducer;
