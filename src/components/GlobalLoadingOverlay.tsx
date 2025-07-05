"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import Lottie from "lottie-react";
import animationData from "@/assets/animations/koripsLoading.json";

export default function GlobalLoadingOverlay() {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
}
