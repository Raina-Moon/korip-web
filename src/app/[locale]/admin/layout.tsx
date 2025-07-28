export const runtime = 'edge';

"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { useGetCurrentUserQuery } from "@/lib/auth/authApi";
import { setUserOnly } from "@/lib/auth/authSlice";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const locale = useLocale();

  const {
    data: fetchedUser,
    isLoading,
    isError,
  } = useGetCurrentUserQuery(undefined, {
    skip: user !== undefined,
  });

  useEffect(() => {
    if (fetchedUser) {
      dispatch(setUserOnly(fetchedUser));
    } else if (isError) {
      dispatch(setUserOnly(null));
    }
  }, [fetchedUser, isError, dispatch]);

  useEffect(() => {
    if (user === null) {
      router.push(`/${locale}/login`);
      return;
    }
    if (user !== undefined && user.role !== "ADMIN") {
      router.replace(`/${locale}/`);
    }
  }, [user, router]);

  useEffect(() => {
    if (user === undefined && isLoading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [user, isLoading, dispatch]);

  return <>{children}</>;
}