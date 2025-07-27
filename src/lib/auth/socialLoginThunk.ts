import axios from "axios";
import { setCredential } from "./authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const socialLoginThunk = createAsyncThunk(
  "auth/socialLogin",
  async (
    { provider, accessToken }: { provider: string; accessToken: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/social-login`,
        { provider, accessToken },
        {
          withCredentials: true,
        }
      );

      const { token, user } = res.data;

      thunkAPI.dispatch(setCredential({ user, token }));
      return user;
    } catch (err) {
      console.error("Social login error:", err);
      throw err;
    }
  }
);
