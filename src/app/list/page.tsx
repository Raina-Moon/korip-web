"use client";

import { useGetAvailableLodgeQuery } from "@/lib/hotspring/hotspringApi";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const ListPage = () => {
  const searchParams = useSearchParams();

  const region = searchParams.get("region") || "전체";
  const checkin = searchParams.get("checkIn") || "Not specified";
  const checkout = searchParams.get("checkOut") || "Not specified";
  const room = searchParams.get("room") || "1";
  const adult = searchParams.get("adult") || "1";
  const children = searchParams.get("children") || "0";

  const {
    data: lodges,
    isLoading,
    isError,
  } = useGetAvailableLodgeQuery({
    region,
    checkin,
    checkout,
    adult,
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
