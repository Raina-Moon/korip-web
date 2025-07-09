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
  reviews: Review[];
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  list: [],
  reservations: [],
  reviews: [],
  state: "idle",
  error: null,
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
        state.list = action.payload;
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
        state.reservations = action.payload;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      });
  },
});

export default adminUserSlice.reducer;
