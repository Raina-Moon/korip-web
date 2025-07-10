import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createLodge,
  deleteLodge,
  fetchLodgeById,
  fetchLodges,
  updateLodge,
} from "./lodgeThunk";
import { Lodge } from "@/types/lodge";

interface LodgeState {
  list: Lodge[];
  detail: Lodge | null;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LodgeState = {
  list: [],
  detail: null,
  state: "idle",
  error: null,
};

const lodgeSlice = createSlice({
  name: "admin/lodge",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLodges.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(fetchLodges.fulfilled, (state, action) => {
        state.state = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchLodges.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchLodgeById.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(fetchLodgeById.fulfilled, (state, action) => {
        state.state = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchLodgeById.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(createLodge.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        createLodge.fulfilled,
        (state, action: PayloadAction<{ message: string; lodge: Lodge }>) => {
          state.state = "succeeded";
          state.list.push(action.payload.lodge);
        }
      )
      .addCase(createLodge.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(updateLodge.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        updateLodge.fulfilled,
        (state, action: PayloadAction<{ message: string; lodge: Lodge }>) => {
          state.state = "succeeded";
          const updatedLodge = action.payload.lodge;
          const index = state.list.findIndex(
            (lodge) => lodge.id === updatedLodge.id
          );
          if (index !== -1) {
            state.list[index] = updatedLodge;
          }
          if (state.detail && state.detail.id === updatedLodge.id) {
            state.detail = updatedLodge;
          }
        }
      )
      .addCase(updateLodge.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteLodge.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(deleteLodge.fulfilled, (state, action) => {
        state.state = "succeeded";
        const deleteId = action.payload.lodge.id;
        state.list = state.list.filter((lodge) => lodge.id !== deleteId);
        if (state.detail && state.detail.id === deleteId) {
          state.detail = null;
        }
      })
      .addCase(deleteLodge.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });
  },
});

export default lodgeSlice.reducer;
