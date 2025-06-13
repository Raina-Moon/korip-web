"use client";

import { usePathname } from "next/navigation";
import React from "react";
import HeaderBar from "./HeaderBar";

const HIDDEN_PATHS = ["/signup", "/admin"];

const HeaderWrapper = () => {
  const pathname = usePathname();

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return <HeaderBar />;
};

export default HeaderWrapper;
