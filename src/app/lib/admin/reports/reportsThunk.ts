import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";

export interface ReportReviews {
  id: number;
  reviewId: number;
  userId: number;
  reason: string;
  createdAt: string;

  review: {
    id: number;
    lodgeId: number;
    userId: number;
    rating: number;
    comment: string;
    isHidden: boolean;
    createdAt: string;
    lodge: {
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

export const fetchReports = createAsyncThunk<
  ReportReviews[],
  void,
  { rejectValue: string }
>("admin/fetchReports", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reports`,
      {
        withCredentials: true,
      }
    );
    return res.data as ReportReviews[];
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to fetch reports");
  }
});

export const deleteReportedReview = createAsyncThunk<
  { message: string; reviewId: number },
  number,
  { rejectValue: string }
>(
  "admin/deleteReportedReview",
  async (reviewId, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reports/review/${reviewId}`,
        { withCredentials: true }
      );
      return res.data as { message: string; reviewId: number };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to delete reported review");
    }
  }
);

export const hideReportReview = createAsyncThunk<
  { message: string; updated: { id: number; isHidden: boolean } },
  number,
  { rejectValue: string }
>("admin/hideReportReview", async (reviewId, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reports/review/${reviewId}/hide`,
      {},
      { withCredentials: true }
    );
    const data = res.data as {
      message: string;
      updated: { id: number; isHidden: boolean };
    };
    return {
      message: data.message,
      updated: { id: data.updated.id, isHidden: data.updated.isHidden },
    };
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to hide reported review");
  }
});
