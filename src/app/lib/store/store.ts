import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../auth/authApi";
import authReducer from "../auth/authSlice";
import resetPasswordReducer from "../reset-password/resetPasswordSlice";
import { hotspringApi } from "../hotspring/hotspringApi";

export const store = configureStore({
    reducer: {
        auth:authReducer,
        resetPassword: resetPasswordReducer,
        [authApi.reducerPath]: authApi.reducer,
        [hotspringApi.reducerPath] : hotspringApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, hotspringApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;