"use client";

import { fetchCurrentUser } from "@/lib/auth/authThunk";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCurrentUser()
  }, [dispatch]);

  return null;
}
