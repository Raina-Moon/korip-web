import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { Support } from "@/types/support";

export interface GetMySupportsResponse {
  items: Support[];
  total: number;
  page: number;
  pageSize: number;
}

export const supportApi = createApi({
  reducerPath: "supportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
  }),
  tagTypes: ["Supports", "SupportDetail"],
  endpoints: (builder) => ({
    getMySupports: builder.query<
      GetMySupportsResponse,
      { page?: number; pageSize?: number } | void
    >({
      query: (args) => {
        const page = args?.page ?? 1;
        const pageSize = args?.pageSize ?? 10;
        return `support/my?page=${page}&pageSize=${pageSize}`;
      },
      providesTags: ["Supports"],
    }),
    getSupportById: builder.query<Support, number>({
      query: (id) => `support/${id}`,
      providesTags: (_r, _e, id) => [{ type: "SupportDetail", id }],
    }),
    createSupport: builder.mutation<
      Support,
      { name: string; question: string }
    >({
      query: (body) => ({
        url: `support`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Supports"],
    }),
  }),
});

export const {
  useGetMySupportsQuery,
  useGetSupportByIdQuery,
  useCreateSupportMutation,
} = supportApi;
