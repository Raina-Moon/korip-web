import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  EventPagination,
  fetchEvents,
  fetchEventById,
  createEventThunk,
  updateEventThunk,
  deleteEventThunk,
} from "./eventsThunk";
import { Event } from "@/types/events";

interface EventsState {
  list: Event[];
  current: Event | null;
  total: number;
  page: number;
  limit: number;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EventsState = {
  list: [],
  current: null,
  total: 0,
  page: 1,
  limit: 10,
  state: "idle",
  error: null,
};

const eventsSlice = createSlice({
  name: "admin/events",
  initialState,
  reducers: {
    clearCurrentEvent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<EventPagination>) => {
        state.state = "succeeded";
        state.list = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload ?? "Failed to fetch events";
      })

      .addCase(fetchEventById.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action: PayloadAction<Event>) => {
        state.state = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload ?? "Failed to fetch event";
      })

      .addCase(createEventThunk.fulfilled, (state, action: PayloadAction<Event>) => {
        state.list.unshift(action.payload);
      })

      .addCase(updateEventThunk.fulfilled, (state, action: PayloadAction<Event>) => {
        const idx = state.list.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.current?.id === action.payload.id) state.current = action.payload;
      })

      .addCase(deleteEventThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter((e) => e.id !== action.payload);
        if (state.current?.id === action.payload) state.current = null;
      });
  },
});

export const { clearCurrentEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
