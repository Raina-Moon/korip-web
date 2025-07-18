import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../auth/authApi";
import authReducer from "../auth/authSlice";
import resetPasswordReducer from "../reset-password/resetPasswordSlice";
import { hotspringApi } from "../hotspring/hotspringApi";
import adminUserReducer from "../admin/user/adminUserSlice";
import lodgeReducer from "../admin/lodge/lodgeSlice";
import roomTypeReducer from "../admin/lodge/roomTypeSlice";
import reportsReducer from "../admin/reports/reportsSlice";
import roomInventoryReducer from "../admin/lodge/roomInventorySlice";
import roomPricingReducer from "../admin/lodge/roomPricingSlice";
import { lodgeApi } from "../lodge/lodgeApi";
import { priceApi } from "../price/priceApi";
import reservationReducer from "../reservation/reservationSlice";
import { reviewApi } from "../review/reviewApi";
import { bookmarkApi } from "../bookmark/bookmarkApi";
import { reportReviewApi } from "../report-review/reportReviewApi";
import loadingReducer from "./loadingSlice";
import adminReservationReducer from "../admin/reservation/reservationSlice";
import { userServiceApi } from "../user/userApi";
import reportsTicketReducer from "../admin/reports/ticketReportsSlice";
import adminTicketReservationReducer from "../admin/reservation/ticketReservationSlice";
import { ticketApi } from "../ticket/ticketApi";
import { ticketBookmarkApi } from "../ticket-bookmark/ticketBookmarkApi";
import ticketReservationReducer from "../ticket-reservation/ticketReservationSlice";
import { ticketReviewApi } from "../ticket-review/ticketReviewApi";
import { reportTicketReviewApi } from "../report-ticket-review/reportTicketReviewApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resetPassword: resetPasswordReducer,
    [authApi.reducerPath]: authApi.reducer,
    [hotspringApi.reducerPath]: hotspringApi.reducer,
    "admin/user": adminUserReducer,
    "admin/lodge": lodgeReducer,
    "admin/roomType": roomTypeReducer,
    "admin/reports": reportsReducer,
    "admin/roomInventory": roomInventoryReducer,
    "admin/roomPricing": roomPricingReducer,
    "admin/ticketReports": reportsTicketReducer,
    adminReservation : adminReservationReducer,
    adminTicketReservation : adminTicketReservationReducer,
    [lodgeApi.reducerPath]: lodgeApi.reducer,
    [priceApi.reducerPath]: priceApi.reducer,
    reservation: reservationReducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [bookmarkApi.reducerPath]: bookmarkApi.reducer,
    [reportReviewApi.reducerPath]: reportReviewApi.reducer,
    loading: loadingReducer,
    [userServiceApi.reducerPath]: userServiceApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [ticketBookmarkApi.reducerPath]: ticketBookmarkApi.reducer,
    ticketReservation: ticketReservationReducer,
    [ticketReviewApi.reducerPath]: ticketReviewApi.reducer,
    [reportTicketReviewApi.reducerPath]: reportTicketReviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      hotspringApi.middleware,
      lodgeApi.middleware,
      priceApi.middleware,
      reviewApi.middleware,
      bookmarkApi.middleware,
      reportReviewApi.middleware,
      userServiceApi.middleware,
      ticketApi.middleware,
      ticketBookmarkApi.middleware,
      ticketReviewApi.middleware,
      reportTicketReviewApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
