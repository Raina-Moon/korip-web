"use client";

import { usePathname } from "next/navigation";
import { useAppDispatch } from "../store/hooks";
import { useEffect } from "react";
import { hideLoading } from "../store/loadingSlice";

export default function NavigationEvents() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hideLoading());
  }, [pathname, dispatch]);

  return null;
}
