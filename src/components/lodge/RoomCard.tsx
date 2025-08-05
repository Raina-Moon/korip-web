"use client";

import Image from "next/image";
import { openLoginModal } from "@/lib/auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import React, { useState } from "react";
import { RoomType, SeasonalPricing } from "@/types/lodge";
import { useTranslation } from "react-i18next";

interface RoomCardProps {
  room: RoomType;
  isAuthenticated: boolean;
  handleReserve: (roomId: number, roomName: string) => void;
  openModal: (images: string[], index: number) => void;
  checkIn?: string;
  checkOut?: string;
}

export default function RoomCard({
  room,
  isAuthenticated,
  handleReserve,
  openModal,
  checkIn,
  checkOut,
}: RoomCardProps) {
  const { t } = useTranslation("lodge");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) {
      return room.basePrice;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const dates: Date[] = [];
    const current = new Date(checkInDate);
    while (current < checkOutDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    let total = 0;

    dates.forEach((date) => {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      const seasonal = room.seasonalPricing?.find((season: SeasonalPricing) => {
        const fromDate = new Date(season.from);
        const toDate = new Date(season.to);
        return date >= fromDate && date <= toDate;
      });

      let priceForDate: number;

      if (seasonal) {
        priceForDate = isWeekend ? seasonal.weekendPrice : seasonal.basePrice;
      } else {
        priceForDate = isWeekend
          ? room.weekendPrice ?? room.basePrice
          : room.basePrice;
      }

      total += priceForDate;
    });

    return total * 1;
  };

  const handleReserveClick = async () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal("lodge/reserve"));
      return;
    }
    if (room.id !== undefined) {
      setIsLoading(true);
      try {
        await handleReserve(room.id, room.name);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div
      className="relative border border-gray-200 rounded-xl p-6 bg-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 animate-fade-in"
      role="article"
      aria-labelledby={`room-title-${room.id}`}
    >
      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
        {room.images?.[0]?.imageUrl ? (
          <Image
            src={room.images[0].imageUrl}
            alt={t("roomImageAlt", { name: room.name })}
            width={400}
            height={200}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            onClick={() => openModal(room.images?.map((img) => img.imageUrl) ?? [], 0)}
            role="button"
            aria-label={t("viewRoomImages", { name: room.name })}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-lg">
            {t("noImage")}
          </div>
        )}
      </div>

      <h3
        id={`room-title-${room.id}`}
        className="text-xl font-semibold text-gray-900 mb-2 truncate"
      >
        {room.name}
      </h3>
      <p className="text-gray-600 text-sm italic mb-3 line-clamp-2">
        {room.description || t("noDescription")}
      </p>
      <div className="flex flex-col gap-2 text-gray-600 text-sm mb-3">
        <p>{t("maxAdults", { count: room.maxAdults })}</p>
        <p>{t("maxChildren", { count: room.maxChildren })}</p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold text-primary-700 bg-primary-100 px-3 py-1 rounded-full">
          {t("totalPrice")}: ₩{(calculateTotalPrice() ?? 0).toLocaleString()}
        </p>
      </div>
      <button
        onClick={handleReserveClick}
        disabled={isLoading}
        className={`w-full sm:w-48 h-10 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label={t("reserve")}
        role="button"
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
            />
          </svg>
        ) : (
          <i className="bi bi-ticket text-xs"></i>
        )}
        {t("reserve")}
      </button>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
