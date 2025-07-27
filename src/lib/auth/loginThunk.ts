import axios from "axios";
import { setCredential } from "./authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const { token, user } = res.data;
    thunkAPI.dispatch(setCredential({ user, token }));

    return user;
  }
);
