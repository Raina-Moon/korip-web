import { createSlice } from "@reduxjs/toolkit";
import {
  deleteUser,
  fetchAllUsers,
  fetchUserReservations,
  fetchUserReviews,
  updateUserRole,
  User,
} from "./adminUserThunk";
import { Reservation } from "@/types/reservation";
import { Review } from "@/types/reivew";

interface UserState {
  list: User[];
  reservations: Reservation[];
  reservationTotal: number;
  reservationPage: number;
  reservationLimit: number;
  reviews: Review[];
  reviewTotal: number;
  reviewPage: number;
  reviewLimit: number;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: UserState = {
  list: [],
  reservations: [],
  reservationTotal: 0,
  reservationPage: 1,
  reservationLimit: 10,
  reviews: [],
  reviewTotal: 0,
  reviewPage: 1,
  reviewLimit: 10,
  state: "idle",
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

const adminUserSlice = createSlice({
  name: "admin/user",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.list = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearUsers: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.state = "succeeded";
        state.list = action.payload.list;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.state = "succeeded";
        const deletedId = action.payload.user.id;
        state.list = state.list.filter((user) => user.id !== deletedId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(updateUserRole.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.state = "succeeded";
        const updatedUser = action.payload.user;
        const index = state.list.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          state.list[index] = updatedUser;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchUserReservations.fulfilled, (state, action) => {
        state.reservations = action.payload.data;
        state.reservationTotal = action.payload.total;
        state.reservationPage = action.payload.page;
        state.reservationLimit = action.payload.limit;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.data;
        state.reviewTotal = action.payload.total;
        state.reviewPage = action.payload.page;
        state.reviewLimit = action.payload.limit;
      });
  },
});

export default adminUserSlice.reducer;
