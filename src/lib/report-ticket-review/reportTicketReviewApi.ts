import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CreateReportTicketReviewRequest {
  reviewId: number;
  reason: string;
}

export interface CreateReportTicketReviewResponse {
  message: string;
  report: {
    id: number;
    reviewId: number;
    userId: number;
    reason: string;
    createdAt: string;
  };
}

export const reportTicketReviewApi = createApi({
  reducerPath: "reportTicketReview",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ["ReportTicketReview"],
  endpoints: (builder) => ({
    createReportTicketReview: builder.mutation<
      CreateReportTicketReviewResponse,
      CreateReportTicketReviewRequest
    >({
      query: (body) => ({
        url: `report-ticket-review`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ReportTicketReview"],
    }),
  }),
});

export const {
  useCreateReportTicketReviewMutation,
} = reportTicketReviewApi;
