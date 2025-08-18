import { Event } from "@/types/events";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface GetEventListResponse {
  items: Event[];
  total: number;
  page: number;
  limit: number;
}

interface AdjacentRes {
  prev: Pick<Event, "id" | "title" | "titleEn" | "createdAt"> | null;
  next: Pick<Event, "id" | "title" | "titleEn" | "createdAt"> | null;
}

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/events`,
    credentials: "include",
  }),
  tagTypes: ["Events"],
  endpoints: (builder) => ({
    getAllEvents: builder.query<
      GetEventListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `?page=${page}&limit=${limit}`,
      providesTags: ["Events"],
    }),
    getEventById: builder.query<Event, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Events", id }],
    }),
    getAdjacentEventById: builder.query<AdjacentRes, number>({
      query: (id) => `/${id}/adjacent`,
      providesTags: (result, error, id) => [{ type: "Events", id }],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useGetAdjacentEventByIdQuery,
} = eventsApi;
