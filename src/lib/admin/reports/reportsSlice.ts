import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  deleteReportedReview,
  deleteReviewOnly,
  fetchReports,
  hideReportReview,
  ReportReviews,
} from "./reportsThunk";

interface ReportsState {
  list: ReportReviews[];
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReportsState = {
  list: [],
  state: "idle",
  error: null,
};

const reportsSlice = createSlice({
  name: "admin/reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        fetchReports.fulfilled,
        (state, action: PayloadAction<ReportReviews[]>) => {
          state.state = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(fetchReports.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteReportedReview.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        deleteReportedReview.fulfilled,
        (
          state,
          action: PayloadAction<{ message: string; reviewId: number }>
        ) => {
          state.state = "succeeded";
          const deletedId = action.payload.reviewId;
          state.list = state.list.filter(
            (report) => report.review.id !== deletedId
          );
        }
      )
      .addCase(deleteReportedReview.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(hideReportReview.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        hideReportReview.fulfilled,
        (
          state,
          action: PayloadAction<{
            message: string;
            updated: { id: number; isHidden: boolean };
          }>
        ) => {
          state.state = "succeeded";
          const { id: hiddenReviewId, isHidden } = action.payload.updated;
          const updatedReport = state.list.findIndex(
            (item) => item.review.id === hiddenReviewId
          );
          if (updatedReport !== -1) {
            state.list[updatedReport].review.isHidden = true;
          }
        }
      )
      .addCase(hideReportReview.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteReviewOnly.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(deleteReviewOnly.fulfilled, (state, action) => {
        state.state = "succeeded";
        const deletedId = action.payload.reviewId;
        state.list = state.list.filter((report) => report.review.id !== deletedId);
      })
      .addCase(deleteReviewOnly.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });
  },
});

export default reportsSlice.reducer;