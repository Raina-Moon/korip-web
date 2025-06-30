"use client";

import { setAccessToken } from "@/lib/auth/authSlice";
import { fetchCurrentUser } from "@/lib/auth/authThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect } from "react";

export default function AuthLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      dispatch(setAccessToken(storedToken));
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return null;
}
