import { createSlice } from "@reduxjs/toolkit";
import { deleteUser, fetchAllUsers, User } from "./adminThunk";

interface UserState {
  list: User[];
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  list: [],
  state: "idle",
  error: null,
};

const userSlice = createSlice({
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
  },
});

export default userSlice.reducer;