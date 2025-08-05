import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllNews,
  fetchNewsById,
  createNewsThunk,
  updateNewsThunk,
  deleteNewsThunk,
  News,
} from "./newsThunk";

interface NewsState {
  list: News[];
  current: News | null;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NewsState = {
  list: [],
  current: null,
  state: "idle",
  error: null,
};

const newsSlice = createSlice({
  name: "admin/news",
  initialState,
  reducers: {
    clearCurrentNews(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNews.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(fetchAllNews.fulfilled, (state, action: PayloadAction<News[]>) => {
        state.state = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAllNews.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      })

      .addCase(fetchNewsById.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(fetchNewsById.fulfilled, (state, action: PayloadAction<News>) => {
        state.state = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchNewsById.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      })

      .addCase(createNewsThunk.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(createNewsThunk.fulfilled, (state, action: PayloadAction<News>) => {
        state.state = "succeeded";
        state.list.unshift(action.payload);
      })
      .addCase(createNewsThunk.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      })

      .addCase(updateNewsThunk.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(updateNewsThunk.fulfilled, (state, action: PayloadAction<News>) => {
        state.state = "succeeded";
        const index = state.list.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.current?.id === action.payload.id) {
          state.current = action.payload;
        }
      })
      .addCase(updateNewsThunk.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      })

      .addCase(deleteNewsThunk.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(deleteNewsThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.state = "succeeded";
        state.list = state.list.filter((news) => news.id !== action.payload);
        if (state.current?.id === action.payload) {
          state.current = null;
        }
      })
      .addCase(deleteNewsThunk.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentNews } = newsSlice.actions;

export default newsSlice.reducer;
