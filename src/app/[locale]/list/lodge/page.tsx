"use client";

import { useGetAvailableLodgeQuery } from "@/lib/lodge/lodgeApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LodgeListPage() {
  const { t } = useTranslation("list-lodge");
  const [selectedSort, setSelectedSort] = useState<string>("popularity");

  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const params = useParams();
  const locale =
    typeof params.locale === "string"
      ? params.locale
      : params.locale?.[0] ?? "ko";

  const region = searchParams.get("region") || "전체";
  const checkIn = searchParams.get("checkIn") || "Not specified";
  const checkOut = searchParams.get("checkOut") || "Not specified";
  const room = searchParams.get("room") || "1";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const sort = searchParams.get("sort") || "popularity";

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
    sort,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [isLoading, dispatch]);

  const handleLodgeClick = (lodgeId: number) => {
    const query = {
      checkIn,
      checkOut,
      adults,
      children,
      room,
    };

    localStorage.setItem("pendingReservation", JSON.stringify(query));
    const search = new URLSearchParams(query).toString();
    router.push(`/${locale}/lodge/${lodgeId}?${search}`);
  };

  const handleSortChange = (e: any) => {
    setSelectedSort(e.target.value);
    const newQuery = new URLSearchParams({
      region,
      checkIn,
      checkOut,
      adults,
      children,
      room,
      sort: e.target.value,
    }).toString();
    router.push(`/${locale}/list/lodge?${newQuery}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-primary-900">
        {t("resultsCount", { count: lodges ? lodges.length : 0 })}
      </h1>
      <select value={selectedSort} onChange={handleSortChange}>
        <option value="popularity">{t("sort.popularity")}</option>
        <option value="reviews">{t("sort.reviews")}</option>
        <option value="price_asc">{t("sort.price_asc")}</option>
        <option value="price_desc">{t("sort.price_desc")}</option>
      </select>

      {lodges?.length === 0 ? (
        <p className="text-lg text-gray-600">{t("noResults")}</p>
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
                  {t("noImage")}
                </div>
              )}
            </div>

            <div className="w-2/3">
              <h2 className="text-lg font-bold text-primary-900">
                {lodge.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-yellow-600 mt-1">
                <span>⭐ {lodge.averageRating?.toFixed(1) ?? "0.0"}</span>
                <span className="text-gray-500">
                  {t("reviewsCount", { count: lodge.reviewCount ?? 0 })}
                </span>
              </div>
              <p className="text-gray-700 mb-2">
                {t("region", { address: lodge.address })}
              </p>

              {lodge.roomTypes?.map((room: any) => (
                <div
                  key={room.id}
                  className="mt-2 border p-2 bg-gray-50 rounded"
                >
                  <p className="font-medium">{room.name}</p>
                  <p className="text-gray-700">
                    {t("maxAdults", { count: room.maxAdults })}
                  </p>
                  <p className="text-gray-700">
                    {t("maxChildren", { count: room.maxChildren })}
                  </p>
                  <p className="text-gray-700">
                    {t("pricePerNight", {
                      price: room.pricePerNight?.toLocaleString(),
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
