"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store/store";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../lib/store/hooks";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else if (user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user,router]);

  return <>{children}</>;
}
