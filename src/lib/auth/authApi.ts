import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "./authThunk";
import { RootState } from "../store/store";
import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/v1/auth";

interface SignupInput {
  nickname: string;
  email: string;
  password: string;
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
    credentials: "include",
    prepareHeaders: prepareAuthHeaders,
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
    login: builder.mutation<
      {
        token: string;
        user: {
          id: number;
          nickname: string;
          email: string;
          role: string;
        };
      },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
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
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRequestVerificationMutation,
  useSignUpMutation,
  useDeleteAccountMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
