import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout, setAccessToken, setUserOnly } from "./authSlice";
import { RootState } from "../store/store";

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
  { rejectValue: string; state: RootState }
>(
  "auth/fetchCurrentUser",
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.accessToken}`,
          },
          withCredentials: true,
        }
      );
      const user = res.data as User;
      dispatch(setUserOnly(user));
      return user;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(setUserOnly(null));
        }
      }
      return rejectWithValue("Failed to fetch current user");
    }
  }
);

export const tryRefreshSession = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("auth/tryRefreshSession", async (_, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );
    const newToken = res.data.accessToken;
    dispatch(setAccessToken(newToken));
    return newToken;
  } catch {
    dispatch(logout());
    return rejectWithValue("Failed to refresh session");
  }
});
