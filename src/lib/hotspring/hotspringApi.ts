import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hotspringApi = createApi({
  reducerPath: "hotspringApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/hotspring`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  endpoints: (builder) => ({
    getHotspringBySido: builder.query({
      query: () => "/",
    }),
  }),
});

export const { useGetHotspringBySidoQuery } = hotspringApi;
