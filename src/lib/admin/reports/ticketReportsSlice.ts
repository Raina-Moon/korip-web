import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTicketReports,
  deleteTicketReportedReview,
  hideTicketReportReview,
  deleteTicketReviewOnly,
  TicketReportReviews,
  TicketReportReviewsPagination,
} from "./ticketReportsThunk";

interface TicketReportsState {
  list: TicketReportReviews[];
  total: number;
  page: number;
  limit: number;
  state: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TicketReportsState = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  state: "idle",
  error: null,
};

const ticketReportsSlice = createSlice({
  name: "admin/ticketReports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketReports.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        fetchTicketReports.fulfilled,
        (state, action: PayloadAction<TicketReportReviewsPagination>) => {
          state.state = "succeeded";
          state.list = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(fetchTicketReports.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteTicketReportedReview.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        deleteTicketReportedReview.fulfilled,
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
      .addCase(deleteTicketReportedReview.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(hideTicketReportReview.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(
        hideTicketReportReview.fulfilled,
        (
          state,
          action: PayloadAction<{
            message: string;
            updated: { id: number; isHidden: boolean };
          }>
        ) => {
          state.state = "succeeded";
          const { id: hiddenReviewId, isHidden } = action.payload.updated;
          const index = state.list.findIndex(
            (item) => item.review.id === hiddenReviewId
          );
          if (index !== -1) {
            state.list[index].review.isHidden = isHidden;
          }
        }
      )
      .addCase(hideTicketReportReview.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteTicketReviewOnly.pending, (state) => {
        state.state = "loading";
        state.error = null;
      })
      .addCase(deleteTicketReviewOnly.fulfilled, (state, action) => {
        state.state = "succeeded";
        const deletedId = action.payload.reviewId;
        state.list = state.list.filter(
          (report) => report.review.id !== deletedId
        );
      })
      .addCase(deleteTicketReviewOnly.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload as string;
      });
  },
});

export default ticketReportsSlice.reducer;
