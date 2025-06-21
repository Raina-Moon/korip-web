import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hotspringApi = createApi({
  reducerPath: "hotspringApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/hotspring`,
  }),
  endpoints: (builder) => ({
    getHotspringBySido: builder.query({
      query: () => "/",
    }),
    getAvailableLodge: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `/search?${query}`;
      },
    }),
  }),
});

export const { useGetHotspringBySidoQuery, useGetAvailableLodgeQuery } =
  hotspringApi;
