// resetPasswordThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendResetCode = createAsyncThunk<
  { message: string },
  { email: string; locale: string },
  { rejectValue: string }
>(
  "resetPassword/sendResetCode",
  async ({ email, locale }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reset-password`,
        { email, locale }
      );
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Something went wrong"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const verifyCode = createAsyncThunk<
  { message: string },
  { email: string; code: string },
  {
    rejectValue: {
      message: string;
      status: number;
      remainingAttempts?: number;
    };
  }
>("resetPassword/verifyCode", async ({ email, code }, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/reset-password/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue({
        message: data?.message || "Something went wrong",
        status: res.status,
        remainingAttempts: data?.remainingAttempts ?? null,
      });
    }
    return data;
  } catch (err: unknown) {
    let errorMessage = "Something went wrong";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return rejectWithValue({
      message: errorMessage,
      status: 500,
      remainingAttempts: undefined,
    });
  }
});

export const updatePassword = createAsyncThunk<
  { message: string },
  { email: string; newPassword: string },
  { rejectValue: string }
>(
  "resetPassword/updatePassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reset-password/update`,
        { email, newPassword }
      );
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Something went wrong"
        );
      }
      return rejectWithValue("Something went wrong");
    }
  }
);
