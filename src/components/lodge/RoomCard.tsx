"use client";

import Image from "next/image";
import { openLoginModal } from "@/lib/auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import React, { useState } from "react";
import { RoomType, SeasonalPricing } from "@/types/lodge";
import { useTranslation } from "react-i18next";
import { getLocalizedRoom } from "@/utils/getLocalizedRoom";

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
  const { t, i18n } = useTranslation("lodge");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const localizedRoom = getLocalizedRoom(room, i18n.language);

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return room.basePrice;

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

      const priceForDate = seasonal
        ? isWeekend
          ? seasonal.weekendPrice
          : seasonal.basePrice
        : isWeekend
        ? room.weekendPrice ?? room.basePrice
        : room.basePrice;

      total += priceForDate;
    });

    return total;
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
      className="
        relative border border-gray-200 rounded-2xl bg-white
        p-4 sm:p-5
        shadow-sm md:shadow-lg
        transition-all duration-300
        md:hover:shadow-xl md:hover:scale-[1.01]
        animate-fade-in
      "
      role="article"
      aria-labelledby={`room-title-${room.id}`}
    >
      <div className="relative w-full rounded-xl overflow-hidden mb-4 aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/9]">
        {room.images?.[0]?.imageUrl ? (
          <Image
            src={room.images[0].imageUrl}
            alt={t("roomImageAlt", { name: room.name })}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 md:hover:scale-105"
            onClick={() =>
              openModal(room.images?.map((img) => img.imageUrl) ?? [], 0)
            }
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
        className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2"
        title={localizedRoom.localizedName}
      >
        {localizedRoom.localizedName}
      </h3>

      <p className="text-gray-600 text-xs sm:text-sm italic mb-3 sm:mb-4 line-clamp-3 md:line-clamp-2">
        {localizedRoom.localizedDescription || t("noDescription")}
      </p>

      <div className="grid grid-cols-2 gap-y-1 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
        <p>{t("maxAdults", { count: room.maxAdults })}</p>
        <p>{t("maxChildren", { count: room.maxChildren })}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p
          className="
            inline-flex items-center text-base sm:text-lg font-bold text-primary-700
            bg-primary-50 sm:bg-primary-100 px-3 py-1 rounded-full
          "
          aria-live="polite"
        >
          {t("totalPrice")}: ₩{(calculateTotalPrice() ?? 0).toLocaleString()}
        </p>

        <button
          onClick={handleReserveClick}
          disabled={isLoading}
          className={`
            w-full sm:w-auto sm:min-w-[11rem] h-10
            bg-primary-600 text-white px-4 rounded-xl
            hover:bg-primary-700
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            transition-all duration-200
            inline-flex items-center justify-center gap-2
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          `}
          aria-label={t("reserve")}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            <i className="bi bi-ticket text-xs" aria-hidden="true"></i>
          )}
          {t("reserve")}
        </button>
      </div>

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
