import { prepareAuthHeaders } from "@/utils/prepareAuthHeaders";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const bookmarkApi = createApi({
    reducerPath: "bookmarkApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
        credentials: "include",
        prepareHeaders: prepareAuthHeaders,
    }),
    tagTypes: ["Bookmarks"],
    endpoints: (builder) => ({
        getMyBookmarks: builder.query<any,void>({
            query: () => `bookmarks`,
            providesTags: ["Bookmarks"],
        }),
        createBookmark: builder.mutation<any,{lodgeId:number}>({
            query: (body) => ({
                url: `bookmark`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Bookmarks"],
        }),
        deleteBookmark: builder.mutation<any,{lodgeId:number}>({
            query: (lodgeId) => ({
                url: `bookmark/${lodgeId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Bookmarks"],
        }),
    }),
})

export const {
    useGetMyBookmarksQuery,
    useCreateBookmarkMutation,
    useDeleteBookmarkMutation,
} = bookmarkApi;