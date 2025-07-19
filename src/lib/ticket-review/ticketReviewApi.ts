import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketReviewApi = createApi({
  reducerPath: "ticketReviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ["TicketReviews"],
  endpoints: (builder) => ({
    getReviewsByTicketTypeId: builder.query<
      any,
      { ticketTypeId: number; page?: number; pageSize?: number }
    >({
      query: ({ ticketTypeId, page = 1, pageSize = 5 }) =>
        `ticket-review/ticket/${ticketTypeId}?page=${page}&pageSize=${pageSize}`,
      providesTags: (result, error, { ticketTypeId }) => [
        { type: "TicketReviews", id: ticketTypeId },
      ],
    }),

    getMyTicketReviews: builder.query<
      any,
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 5 }) =>
        `ticket-review/my?page=${page}&pageSize=${pageSize}`,
      providesTags: ["TicketReviews"],
    }),

    createTicketReview: builder.mutation({
      query: (body) => ({
        url: `ticket-review`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { ticketTypeId }) => [
        { type: "TicketReviews", id: ticketTypeId },
      ],
    }),

    updateTicketReview: builder.mutation({
      query: ({ reviewId, data }) => ({
        url: `ticket-review/${reviewId}`,
        method: "PATCH",
        body:data,
      }),
      invalidatesTags: ["TicketReviews"],
    }),

    deleteTicketReview: builder.mutation({
      query: (id) => ({
        url: `ticket-review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TicketReviews"],
    }),
  }),
});

export const {
  useGetReviewsByTicketTypeIdQuery,
  useGetMyTicketReviewsQuery,
  useCreateTicketReviewMutation,
  useUpdateTicketReviewMutation,
  useDeleteTicketReviewMutation,
} = ticketReviewApi;
