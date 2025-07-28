import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { Ticket } from "@/types/ticket";
import { TicketReview } from "@/types/ticketReview";

interface TicketSearchParams {
  lodgeId?: number;
  date?: string;
  region?: string;
  adults?: number;
  children?: number;
  sort?: string;
}

interface TicketReviewCreateResponse {
  message: string;
  review: TicketReview;
}

interface TicketReviewUpdateResponse {
  message: string;
  review: TicketReview;
}

interface TicketReviewDeleteResponse {
  message: string;
  reviewId: number;
}

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/ticket`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ["TicketReviews"],
  endpoints: (builder) => ({
    getAvailableTicket: builder.query<Ticket[], TicketSearchParams>({
      query: (params) => {
        const query = new URLSearchParams(
          Object.entries(params || {})
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]) as [string, string][]
        ).toString();
        return `/search?${query}`;
      },
    }),
    getTicketById: builder.query<Ticket, number | string>({
      query: (ticketId) => `/${ticketId}`,
    }),

    getTicketReviews: builder.query<TicketReview[], number | string>({
      query: (ticketId) => `/${ticketId}/reviews`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({
                type: "TicketReviews" as const,
                id: r.id,
              })),
              { type: "TicketReviews", id: "LIST" },
            ]
          : [{ type: "TicketReviews", id: "LIST" }],
    }),
    createTicketReview: builder.mutation<
      TicketReviewCreateResponse,
      { id: number | string; data: { rating: number; comment?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/${id}/review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "TicketReviews", id: "LIST" }],
    }),
    updateTicketReview: builder.mutation<
      TicketReviewUpdateResponse,
      { reviewId: number; data: { rating: number; comment?: string } }
    >({
      query: ({ reviewId, data }) => ({
        url: `/review/${reviewId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "TicketReviews", id: reviewId },
        { type: "TicketReviews", id: "LIST" },
      ],
    }),

    deleteTicketReview: builder.mutation<TicketReviewDeleteResponse, number>({
      query: (reviewId) => ({
        url: `/review/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "TicketReviews", id },
        { type: "TicketReviews", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAvailableTicketQuery,
  useGetTicketByIdQuery,
  useGetTicketReviewsQuery,
  useCreateTicketReviewMutation,
  useUpdateTicketReviewMutation,
  useDeleteTicketReviewMutation,
} = ticketApi;
