import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/auth";

interface SignupInput {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupSuccessResponse {
  id: number;
  nickname: string;
  email: string;
  createdAt: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    requestVerification: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/request-verify",
        method: "POST",
        body,
      }),
    }),
    signUp: builder.mutation<SignupSuccessResponse, SignupInput>({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),
    deleteAccount: builder.mutation<{ message: string }, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRequestVerificationMutation,
  useSignUpMutation,
  useDeleteAccountMutation,
} = authApi;
