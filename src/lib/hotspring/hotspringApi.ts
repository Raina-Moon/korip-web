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
  }),
});

export const { useGetHotspringBySidoQuery } = hotspringApi;
