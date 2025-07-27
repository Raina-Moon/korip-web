// src/components/ClientApp.tsx
"use client";

import React from "react";
import { Providers } from "@/lib/providers/providers";
import TranslationsProvider from "@/lib/i18n/TranslationsProvider";
import AuthLoader from "@/components/AuthLoader";
import HeaderWrapper from "@/components/HeaderWrapper";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay";
import NavigationEvents from "@/lib/providers/NavigationEvents";
import { Toaster } from "react-hot-toast";
export default function ClientApp({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <TranslationsProvider>
        <Toaster position="top-center"/>
        <AuthLoader />
        <HeaderWrapper />
        <GlobalLoadingOverlay />
        {children}
        <NavigationEvents />
      </TranslationsProvider>
    </Providers>
  );
}
