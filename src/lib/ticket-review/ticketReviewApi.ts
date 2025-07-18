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
    getReviewsByTicketTypeId: builder.query({
      query: (ticketTypeId) => `ticket-review/ticket/${ticketTypeId}`,
      providesTags: (result, error, ticketTypeId) => [
        { type: "TicketReviews", id: ticketTypeId },
      ],
    }),

    getMyTicketReviews: builder.query<any, void>({
      query: () => `ticket-review/my`,
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
      query: ({ id, ...body }) => ({
        url: `ticket-review/${id}`,
        method: "PATCH",
        body,
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
