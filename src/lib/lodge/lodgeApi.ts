import { Lodge } from "@/types/lodge";
import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const lodgeApi = createApi({
  reducerPath: "lodgeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1/lodge`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  endpoints: (builder) => ({
    getAvailableLodge: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `/search?${query}`;
      },
    }),
    getLodgeById: builder.query<Lodge, number | string>({
      query: (lodgeId) => `/${lodgeId}`,
    }),
  }),
});

export const { useGetAvailableLodgeQuery,useGetLodgeByIdQuery } = lodgeApi;
