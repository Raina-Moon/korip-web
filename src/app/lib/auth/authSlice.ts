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
}

const initialState: AuthState = {
  user: undefined,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setUserOnly: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
  },
});

export const { logout, setUserOnly } = authSlice.actions;
export default authSlice.reducer;
