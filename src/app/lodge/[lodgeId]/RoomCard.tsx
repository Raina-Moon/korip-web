"use client";

import Image from "next/image";
import { openLoginModal } from "@/lib/auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import React from "react";

interface RoomCardProps {
  room: {
    id: number;
    name: string;
    description: string | null;
    maxAdults: number;
    maxChildren: number;
    basePrice: number;
    weekendPrice?: number;
    images?: { imageUrl: string }[];
  };
  isAuthenticated: boolean;
  handleReserve: (roomId: number, roomName: string) => void;
  openModal: (images: string[], index: number) => void;
}

export default function RoomCard({
  room,
  isAuthenticated,
  handleReserve,
  openModal,
}: RoomCardProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
      <h3 className="text-xl font-bold mb-2">{room.name}</h3>
      <p className="text-primary-700 mb-1">{room.description}</p>
      <p className="text-gray-600 mb-1">성인 최대 인원: {room.maxAdults}</p>
      <p className="text-gray-600 mb-1">어린이 최대 인원: {room.maxChildren}</p>
      <p className="text-gray-600 mb-2">
        기본 가격: ₩{room.basePrice.toLocaleString()}
      </p>
      <p className="text-gray-600 mb-2">
        주말 가격: ₩
        {room.weekendPrice !== undefined
          ? room.weekendPrice.toLocaleString()
          : room.basePrice.toLocaleString()}
      </p>
      <button
        onClick={() => {
          if (!isAuthenticated) {
            dispatch(openLoginModal("reserve"));
          } else {
            handleReserve(room.id, room.name);
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
