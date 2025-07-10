import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userServiceApi = createApi({
    reducerPath: "userServiceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
        credentials: "include",
        prepareHeaders: prepareAuthHeaders,
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        updateUserNickname: builder.mutation({
            query: (newNickname) => ({
                url: `user/nickname`,
                method: "PATCH",
                body: { nickname: newNickname },
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: (_:void) => ({
                url: `user`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
    }),
})

export const {
    useUpdateUserNicknameMutation,
    useDeleteUserMutation,
} = userServiceApi;
