import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { Ticket } from "@/types/ticket";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/ticket`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  endpoints: (builder) => ({
    getAvailableTicket: builder.query<Ticket[], any>({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `/search?${query}`;
      },
    }),
  }),
});

export const { useGetAvailableTicketQuery } = ticketApi;
