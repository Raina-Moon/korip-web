import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const priceApi = createApi({
  reducerPath: "priceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
  }),
  endpoints: (builder) => ({
    priceCalc: builder.mutation({
      query: ({ checkIn, checkOut, roomTypeId, roomCount }) => ({
        url: "/price/calculate",
        method: "POST",
        body: {
          checkIn,
          checkOut,
          roomTypeId,
          roomCount,
        },
      }),
    }),
  }),
});

export const { usePriceCalcMutation } = priceApi;
