"use client";

import { useGetAvailableLodgeQuery } from "@/lib/lodge/lodgeApi";
import { useSearchParams } from "next/navigation";
import React from "react";

const ListPage = () => {
  const searchParams = useSearchParams();

  const region = searchParams.get("region") || "전체";
  const checkIn = searchParams.get("checkIn") || "Not specified";
  const checkOut = searchParams.get("checkOut") || "Not specified";
  const room = searchParams.get("room") || "1";
  const adults = searchParams.get("adult") || "1";
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

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-primary-900">검색 결과</h1>
      {lodges?.length === 0 ? (
        <p className="text-lg text-gray-600">검색 결과가 없습니다.</p>
      ) : (
        lodges?.map((lodge:any) => (
          <div key={lodge.id} className="border p-4 mb-4 rounded-lg">
            <h2 className="text-lg font-bold text-primary-900">{lodge.name}</h2>
            <p className="text-gray-700">지역: {lodge.region}</p>
            {lodge.roomTypes?.map((room:any) => (
              <div key={room.id} className="mt-2 border p-2 bg-gray-50">
                <p className="font-medium">{room.name}</p>
                <p className="text-gray-700">성인 수: {lodge.adult}</p>
                <p className="text-gray-700">어린이 수: {lodge.children}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ListPage;
