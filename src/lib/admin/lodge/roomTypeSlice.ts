import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createRoomType,
  deleteRoomType,
  fetchRoomTypes,
  updateRoomType,
} from "./roomTypeThunk";
import { RoomType } from "@/types/lodge";

interface RoomTypeState {
  list: RoomType[];
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RoomTypeState = {
  list: [],
  state: "idle",
  error: null,
};

const roomTypeSlice = createSlice({
  name: "admin/roomType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomTypes.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        fetchRoomTypes.fulfilled,
        (state, action: PayloadAction<RoomType[]>) => {
          state.state = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(fetchRoomTypes.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(createRoomType.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        createRoomType.fulfilled,
        (
          state,
          action: PayloadAction<{ message: string; roomType: RoomType }>
        ) => {
          state.state = "succeeded";
          state.list.push(action.payload.roomType);
        }
      )
      .addCase(createRoomType.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(updateRoomType.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        updateRoomType.fulfilled,
        (
          state,
          action: PayloadAction<{ message: string; roomType: RoomType }>
        ) => {
          state.state = "succeeded";
          const index = state.list.findIndex(
            (roomType) => roomType.id === action.payload.roomType.id
          );
          if (index !== -1) {
            state.list[index] = action.payload.roomType;
          }
        }
      )
      .addCase(updateRoomType.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteRoomType.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(deleteRoomType.fulfilled, (state, action) => {
        state.state = "succeeded";
        const deletedId = action.meta.arg;
        state.list = state.list.filter((roomType) => roomType.id !== deletedId);
      })
      .addCase(deleteRoomType.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });
  },
});

export default roomTypeSlice.reducer;
