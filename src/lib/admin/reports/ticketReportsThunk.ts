import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";
import { RootState } from "@/lib/store/store";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";

export interface TicketReportReviews {
  id: number;
  reviewId: number;
  userId: number;
  reason: string;
  createdAt: string;

  review: {
    id: number;
    ticketTypeId: number;
    userId: number;
    rating: number;
    comment: string;
    isHidden: boolean;
    createdAt: string;
    ticketType: {
      id: number;
      name: string;
    };
    user: {
      id: number;
      nickname: string;
    };
  };

  user: {
    id: number;
    nickname: string;
  };
}

export interface TicketReportReviewsPagination {
  data: TicketReportReviews[];
  total: number;
  page: number;
  limit: number;
}

export const fetchTicketReports = createAsyncThunk<
  TicketReportReviewsPagination,
  { page?: number; limit?: number },
  { rejectValue: string; state: RootState }
>(
  "admin/fetchTicketReports",
  async ({ page = 1, limit = 10 }, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(showLoading());
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ticket-reports`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as TicketReportReviewsPagination;
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to fetch ticket reports");
    } finally {
      dispatch(hideLoading());
    }
  }
);

export const deleteTicketReportedReview = createAsyncThunk<
  { message: string; reviewId: number },
  number,
  { rejectValue: string; state: RootState }
>(
  "admin/deleteTicketReportedReview",
  async (reviewId, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ticket-reports/report-only/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as { message: string; reviewId: number };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to delete ticket reported review");
    }
  }
);

export const hideTicketReportReview = createAsyncThunk<
  { message: string; updated: { id: number; isHidden: boolean } },
  { reviewId: number; isHidden: boolean },
  { rejectValue: string; state: RootState }
>(
  "admin/hideTicketReportReview",
  async ({ reviewId, isHidden }, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ticket-reports/review/${reviewId}/hide`,
        { isHidden },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const data = res.data as {
        message: string;
        updated: { id: number; isHidden: boolean };
      };

      return {
        message: data.message,
        updated: {
          id: data.updated.id,
          isHidden: data.updated.isHidden,
        },
      };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to hide ticket review");
    }
  }
);

export const deleteTicketReviewOnly = createAsyncThunk<
  { message: string; reviewId: number },
  number,
  { rejectValue: string; state: RootState }
>(
  "admin/deleteTicketReviewOnly",
  async (reviewId, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/ticket-reports/review-only/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as { message: string; reviewId: number };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to delete ticket review");
    }
  }
);
