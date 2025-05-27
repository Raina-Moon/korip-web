import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendResetCode = createAsyncThunk(
  "resetPassword/sendResetCode",
  async (email: string, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reset-password/send-code`,
        {
          email,
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.res.data.message);
    }
  }
);

export const verifyCode = createAsyncThunk(
  "resetPassword/verifyCode",
  async ({ email, code }: { email: string; code: string }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reset-password/verify-code`,
        {
          email,
          code,
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
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
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reset-password/update-password`,
        { email, newPassword }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
