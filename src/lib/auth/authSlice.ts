import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthState {
  user: User | null | undefined;
  isAuthenticated: boolean;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: undefined,
  isAuthenticated: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
    },
    setUserOnly: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    setCredential : (state,action:PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;
    },
  },
});

export const { logout, setUserOnly, setCredential } = authSlice.actions;
export default authSlice.reducer;
