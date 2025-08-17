import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Support, SupportPagination } from "@/types/support";
import { fetchAllSupports, patchSupport } from "./supportThunk";

interface AdminSupportState {
  list: Support[];
  total: number;
  page: number;
  limit: number;
  current: Support | null;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdminSupportState = {
  list: [],
  total: 0,
  page: 1,
  limit: 20,
  current: null,
  state: "idle",
  error: null,
};

const adminSupportSlice = createSlice({
  name: "admin/support",
  initialState,
  reducers: {
    clearCurrentSupport(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSupports.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllSupports.fulfilled,
        (state, action: PayloadAction<SupportPagination>) => {
          state.state = "succeeded";
          state.list = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(fetchAllSupports.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      })
      .addCase(patchSupport.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        patchSupport.fulfilled,
        (state, action: PayloadAction<Support>) => {
          state.state = "succeeded";
          const idx = state.list.findIndex((s) => s.id === action.payload.id);
          if (idx !== -1) state.list[idx] = action.payload;
          if (state.current?.id === action.payload.id)
            state.current = action.payload;
        }
      )
      .addCase(patchSupport.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentSupport } = adminSupportSlice.actions;
export default adminSupportSlice.reducer;
