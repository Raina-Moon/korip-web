import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../auth/authApi";
import authReducer from "../auth/authSlice";
import resetPasswordReducer from "../reset-password/resetPasswordSlice";
import { hotspringApi } from "../hotspring/hotspringApi";
import userReducer from "../admin/user/userSlice";
import lodgeReducer from "../admin/lodge/lodgeSlice";
import roomTypeReducer from "../admin/lodge/roomTypeSlice";
import reportsReducer from "../admin/reports/reportsSlice";
import roomInventoryReducer from "../admin/lodge/roomInventorySlice";
import roomPricingReducer from "../admin/lodge/roomPricingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resetPassword: resetPasswordReducer,
    [authApi.reducerPath]: authApi.reducer,
    [hotspringApi.reducerPath]: hotspringApi.reducer,
    "admin/user": userReducer,
    "admin/lodge": lodgeReducer,
    "admin/roomType": roomTypeReducer,
    "admin/reports": reportsReducer,
    "admin/roomInventory": roomInventoryReducer,
    "admin/roomPricing": roomPricingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, hotspringApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
