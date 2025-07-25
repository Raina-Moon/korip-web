import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendResetCode = createAsyncThunk(
  "resetPassword/sendResetCode",
  async (email: string, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reset-password`,
        {
          email,
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const verifyCode = createAsyncThunk(
  "resetPassword/verifyCode",
  async ({ email, code }: { email: string; code: string }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reset-password/verify`,
        {
          email,
          code,
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue({
        message: err.response?.data?.message || "Something went wrong",
        status: err.response?.status || 500,
        remainingAttempts: err.response?.data?.remainingAttempts,
      });
    }
  }
);
export const updatePassword = createAsyncThunk(
  "resetPassword/updatePassword",
  async (
    { email, newPassword }: { email: string; newPassword: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reset-password/update`,
        { email, newPassword }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);
