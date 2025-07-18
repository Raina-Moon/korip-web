import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getReviewsByLodgeId: builder.query({
      query: ({ lodgeId, page = 1, pageSize = 5 }) =>
        `review/lodge/${lodgeId}?page=${page}&pageSize=${pageSize}`,
      providesTags: (result, error, lodgeId) => [
        { type: "Reviews", id: lodgeId },
      ],
    }),
    getReviewsByUserId: builder.query<
      any,
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 5 }) =>
        `review/my?page=${page}&pageSize=${pageSize}`,
      providesTags: ["Reviews"],
    }),
    createReview: builder.mutation({
      query: (body) => ({
        url: `review`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `review/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetReviewsByLodgeIdQuery,
  useGetReviewsByUserIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
