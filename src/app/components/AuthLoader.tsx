"use client"

import { setCredential } from "@/app/lib/auth/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(setCredential({ token, user: JSON.parse(user) }));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return null;
}
