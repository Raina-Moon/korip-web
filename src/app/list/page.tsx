"use client";

import { useGetAvailableLodgeQuery } from "@/lib/lodge/lodgeApi";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const ListPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const region = searchParams.get("region") || "전체";
  const checkIn = searchParams.get("checkIn") || "Not specified";
  const checkOut = searchParams.get("checkOut") || "Not specified";
  const room = searchParams.get("room") || "1";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";

  const {
    data: lodges,
    isLoading,
    isError,
  } = useGetAvailableLodgeQuery({
    region,
    checkIn,
    checkOut,
    adults,
    children,
    room,
  });

  const handleLodgeClick = (lodgeId: number) => {
    const query = {
      checkIn,
      checkOut,
      adults,
      children,
      room,
    }

    localStorage.setItem("pendingReservation", JSON.stringify(query));
    const search = new URLSearchParams(query).toString();
    router.push(`/lodge/${lodgeId}?${search}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-primary-900">검색 결과 {lodges ? lodges.length : 0}</h1>
      {lodges?.length === 0 ? (
        <p className="text-lg text-gray-600">검색 결과가 없습니다.</p>
      ) : (
        lodges?.map((lodge: any) => (
          <div
            key={lodge.id}
            className="border p-4 mb-4 rounded-lg flex gap-4 hover:shadow cursor-pointer transition"
            onClick={() => handleLodgeClick(lodge.id)}
          >
            <div className="w-1/3 h-40 relative rounded overflow-hidden">
              {lodge.images?.[0]?.imageUrl ? (
                <img
                  src={lodge.images[0].imageUrl}
                  alt={lodge.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
            </div>

            <div className="w-2/3">
              <h2 className="text-lg font-bold text-primary-900">
                {lodge.name}
              </h2>
              <p className="text-gray-700 mb-2">지역: {lodge.address}</p>

              {lodge.roomTypes?.map((room: any) => (
                <div
                  key={room.id}
                  className="mt-2 border p-2 bg-gray-50 rounded"
                >
                  <p className="font-medium">{room.name}</p>
                  <p className="text-gray-700">
                    최대 성인 수: {room.maxAdults}
                  </p>
                  <p className="text-gray-700">
                    최대 어린이 수: {room.maxChildren}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListPage;
