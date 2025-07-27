"use client";

import { logout, setAccessToken } from "@/lib/auth/authSlice";
import { fetchCurrentUser, tryRefreshSession } from "@/lib/auth/authThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect } from "react";

export default function AuthLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if(storedToken) {
        dispatch(setAccessToken(storedToken));
        try {
          await dispatch(fetchCurrentUser()).unwrap();
        } catch {
          try {
            const newToken = await dispatch(tryRefreshSession()).unwrap();
            dispatch(setAccessToken(newToken));
            await dispatch(fetchCurrentUser()).unwrap();
          } catch {
            dispatch(logout());
          }
        }
      }
    };
    initializeAuth();
  }, [dispatch]);

  return null;
}
