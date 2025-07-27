import { TicketBookmark } from "@/types/ticket";
import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const ticketBookmarkApi = createApi({
  reducerPath: "ticketBookmarkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/ticket-bookmark`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ["TicketBookmarks"],
  endpoints: (builder) => ({
    getMyTicketBookmarks: builder.query<TicketBookmark[], void>({
      query: () => `/`,
      providesTags: ["TicketBookmarks"],
    }),
    createTicketBookmark: builder.mutation<TicketBookmark, { ticketId: number }>({
      query: (body) => ({
        url: `/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TicketBookmarks"],
    }),
    deleteTicketBookmark: builder.mutation<TicketBookmark, number>({
      query: (ticketId) => ({
        url: `/${ticketId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TicketBookmarks"],
    }),
  }),
});

export const {
  useGetMyTicketBookmarksQuery,
  useCreateTicketBookmarkMutation,
  useDeleteTicketBookmarkMutation,
} = ticketBookmarkApi;
