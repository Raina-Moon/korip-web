"use client";

import Image from "next/image";
import { openLoginModal } from "@/lib/auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import React from "react";
import { RoomType, SeasonalPricing } from "@/types/lodge";

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
  const dispatch = useAppDispatch();

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) {
      return room.basePrice;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const dates: Date[] = [];
    let current = new Date(checkInDate);
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

  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
      <h3 className="text-xl font-bold mb-2">{room.name}</h3>
      <p className="text-primary-700 mb-1">{room.description}</p>
      <p className="text-gray-600 mb-1">성인 최대 인원: {room.maxAdults}</p>
      <p className="text-gray-600 mb-1">어린이 최대 인원: {room.maxChildren}</p>
      <p className="text-lg font-bold text-primary-900 mb-2">
        총 예상 숙박 요금: ₩{calculateTotalPrice().toLocaleString()}
      </p>
      <button
        onClick={() => {
          if (!isAuthenticated) {
            dispatch(openLoginModal("lodge/reserve"));
          } else {
            if (room.id !== undefined) {
              handleReserve(room.id, room.name);
            }
          }
        }}
        className="mt-4 bg-primary-800 text-white px-4 py-2 rounded hover:bg-primary-500"
      >
        이 객실 예약하기
      </button>
      {room.images?.[0]?.imageUrl && (
        <Image
          src={room.images[0].imageUrl}
          alt={room.name}
          width={400}
          height={200}
          className="rounded object-cover w-full h-48 mt-2 hover:cursor-pointer"
          onClick={() =>
            openModal(room.images?.map((img) => img.imageUrl) ?? [], 0)
          }
        />
      )}
    </div>
  );
}
