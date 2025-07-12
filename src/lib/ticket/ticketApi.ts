import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { Ticket } from "@/types/ticket";
import { TicketReview } from "@/types/ticketReview";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/ticket`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ["TicketReviews"],
  endpoints: (builder) => ({
    getAvailableTicket: builder.query<Ticket[], any>({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `/search?${query}`;
      },
    }),
    getTicketById: builder.query<Ticket, number | string>({
      query: (ticketId) => `/${ticketId}`,
    }),

    getTicketReviews: builder.query<TicketReview[], number | string>({
      query: (ticketId) => `/${ticketId}/reviews`,
      providesTags: (result, error, id) =>
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
      any,
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
      any,
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

    deleteTicketReview: builder.mutation<any, number>({
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
