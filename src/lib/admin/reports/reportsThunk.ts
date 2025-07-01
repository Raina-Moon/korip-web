import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";
import { RootState } from "@/lib/store/store";

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
  { rejectValue: string; state: RootState }
>("admin/fetchReports", async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reports`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  { rejectValue: string; state: RootState }
>(
  "admin/deleteReportedReview",
  async (reviewId, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reports/review/${reviewId}`,
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
      return rejectWithValue("Failed to delete reported review");
    }
  }
);

export const hideReportReview = createAsyncThunk<
  { message: string; updated: { id: number; isHidden: boolean } },
  {reviewId: number; isHidden: boolean},
  { rejectValue: string; state: RootState }
>(
  "admin/hideReportReview",
  async ({reviewId, isHidden}, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/reports/review/${reviewId}/hide`,
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
        updated: { id: data.updated.id, isHidden: data.updated.isHidden },
      };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to hide reported review");
    }
  }
);
