import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { News } from "@/types/news";

interface GetNewsListResponse {
  items: News[];
  total: number;
  page: number;
  limit: number;
}

interface AdjacentRes {
  prev: Pick<News, "id" | "title" | "titleEn" | "createdAt"> | null;
  next: Pick<News, "id" | "title" | "titleEn" | "createdAt"> | null;
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/news`,
    credentials: "include",
  }),
  tagTypes: ["News"],
  endpoints: (builder) => ({
    getAllNews: builder.query<
      GetNewsListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `?page=${page}&limit=${limit}`,
      providesTags: ["News"],
    }),
    getNewsById: builder.query<News, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "News", id }],
    }),
    getAdjacentNewsById: builder.query<AdjacentRes, number>({
      query: (id) => `/${id}/adjacent`,
      providesTags: (result, error, id) => [{ type: "News", id }],
    }),
  }),
});

export const {
  useGetAllNewsQuery,
  useGetNewsByIdQuery,
  useGetAdjacentNewsByIdQuery,
} = newsApi;
