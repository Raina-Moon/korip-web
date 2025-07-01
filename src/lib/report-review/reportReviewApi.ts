import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CreateReportReviewRequest {
  reviewId: number;
  reason: string;
}

export interface CreateReportReviewResponse {
  message: string;
  report: {
    id: number;
    reviewId: number;
    userId: number;
    reason: string;
    createdAt: string;
  };
}

export const reportReviewApi = createApi({
  reducerPath: "reportReview",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ["ReportReview"],
  endpoints: (builder) => ({
    createReportReview: builder.mutation<
      CreateReportReviewResponse,
      CreateReportReviewRequest
    >({
      query: (body) => ({
        url: `report-review`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ReportReview"],
    }),
  }),
});

export const { useCreateReportReviewMutation } = reportReviewApi;
