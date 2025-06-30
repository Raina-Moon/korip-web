import { RootState } from "@/lib/store/store";
import { BaseQueryApi } from "@reduxjs/toolkit/query";

export const prepareAuthHeaders = (
  headers: Headers,
  { getState }: Pick<BaseQueryApi, "getState">
) => {
  const token = (getState() as RootState).auth.accessToken;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};
