import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type LoginModalContextType =
  | "lodge/bookmark"
  | "lodge/reserve"
  | "ticket/bookmark"
  | "ticket/reserve";

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
  showingLoginModal: boolean;
  loginModalContext: LoginModalContextType | null;
  redirectAfterLogin: string | null;
}

const initialState: AuthState = {
  user: undefined,
  isAuthenticated: false,
  accessToken: null,
  showingLoginModal: false,
  loginModalContext: null,
  redirectAfterLogin: null,
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
    setCredential: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;

      if (action.payload.token) {
        localStorage.setItem("accessToken", action.payload.token);
      } else {
        localStorage.removeItem("accessToken");
      }
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      if (action.payload) {
        localStorage.setItem("accessToken", action.payload);
      } else {
        localStorage.removeItem("accessToken");
      }
    },
    openLoginModal: (
      state,
      action: PayloadAction<LoginModalContextType | null>
    ) => {
      state.showingLoginModal = true;
      state.loginModalContext = action.payload;
    },
    closeLoginModal: (state) => {
      state.showingLoginModal = false;
      state.loginModalContext = null;
    },
    updateNickname(state, action) {
      if (state.user) {
        state.user.nickname = action.payload;
      }
    },
    setRedirectAfterLogin: (state, action: PayloadAction<string | null>) => {
      state.redirectAfterLogin = action.payload;
    },
    clearRedirectAfterLogin: (state) => {
      state.redirectAfterLogin = null;
    },
  },
});

export const {
  logout,
  setUserOnly,
  setCredential,
  setAccessToken,
  openLoginModal,
  closeLoginModal,
  updateNickname,
  setRedirectAfterLogin,
  clearRedirectAfterLogin,
} = authSlice.actions;
export default authSlice.reducer;
