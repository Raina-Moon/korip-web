import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setUserOnly } from "./authSlice";

export interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
  createdAt: string;
}

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`,
      {
        withCredentials: true,
      }
    );
    const user = res.data as User;
    dispatch(setUserOnly(user));
    return user;
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(setUserOnly(null));
    }
    return rejectWithValue("Failed to fetch current user");
  }
});
