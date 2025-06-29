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
      providesTags: (result, error, lodgeId) => [
        { type: "Reviews", id: lodgeId },
      ],
    }),
    getReviewsByUserId: builder.query<any,void>({
      query: () => `review/my`,
      providesTags: ["Reviews"],
    }),
    createReview: builder.mutation({
      query: (body) => ({
        url: `review`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { lodgeId }) => [
        { type: "Reviews", id: lodgeId },
      ],
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
