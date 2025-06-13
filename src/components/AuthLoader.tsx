"use client";

import { setUserOnly } from "@/lib/auth/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/me`, {
          withCredentials: true,
        });
        dispatch(setUserOnly(res.data.user));
      } catch (error) {
        console.error("Failed to fetch user:", error);
        dispatch(setUserOnly(null));
      }
    };
    fetchUser();
  }, [dispatch]);

  return null;
}
