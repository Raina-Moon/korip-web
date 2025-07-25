import { createSlice } from "@reduxjs/toolkit";
import {
  sendResetCode,
  updatePassword,
  verifyCode,
} from "./resetPasswordThunk";

const initialState = {
  email: "",
  isCodeVerified: false,
  isLoading: false,
  error: null as string | null,
  remainingAttempts: null as number | null,
  attemptsExceeded: false,
};

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendResetCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendResetCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendResetCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.isCodeVerified = true;
        state.error = null;
        state.remainingAttempts = null;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        const payload = action.payload as {
          message?: string;
          remainingAttempts?: number;
          status?: number;
        };

        state.isLoading = false;
        state.error = payload?.message || "Invalid code.";
        state.remainingAttempts = payload?.remainingAttempts ?? null;
        state.attemptsExceeded = payload?.status === 429;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isCodeVerified = false;
      });
  },
});

export const { setEmail } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
