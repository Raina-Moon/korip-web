import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
  }),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getReviewsByLodgeId: builder.query({
      query: (lodgeId) => `review/lodge/${lodgeId}`,
    }),
    createReview: builder.mutation({
      query: (body) => ({
        url: `review`,
        method: "POST",
        body,
      }),
    }),
    updateReview: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `review/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `review/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetReviewsByLodgeIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
