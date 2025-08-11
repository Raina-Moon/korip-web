"use client";

import ReservationSearchBox from "@/components/lodge/ReservationSearchBox";
import { useGetAvailableLodgeQuery } from "@/lib/lodge/lodgeApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { Lodge, RoomType } from "@/types/lodge";
import { getLocalizedLodgeName } from "@/utils/getLocalizedLodgeField";
import { getLocalizedRoom } from "@/utils/getLocalizedRoom";
import { useLoadingRouter } from "@/utils/useLoadingRouter";
import { useLocale } from "@/utils/useLocale";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LodgeListPage() {
  const { t, i18n } = useTranslation("list-lodge");

  const searchParams = useSearchParams();

  const region = searchParams.get("region") || "전체";
  const accommodationType = searchParams.get("accommodationType") || "전체";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const room = searchParams.get("room") || "1";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const sort = searchParams.get("sort") || "popularity";
  const [selectedSort, setSelectedSort] = useState<string>("popularity");

  const [checkInDate, setCheckIn] = useState(checkIn);
  const [checkOutDate, setCheckOut] = useState(checkOut);
  const [calendar, setCalendar] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(
    checkIn &&
      checkOut &&
      !isNaN(new Date(checkIn).getTime()) &&
      !isNaN(new Date(checkOut).getTime())
      ? [new Date(checkIn), new Date(checkOut)]
      : null
  );
  const [newRegion, setNewRegion] = useState(region);
  const [newAccommodationType, setNewAccommodationType] =
    useState(accommodationType);

  const [adultCount, setAdults] = useState(Number(adults));
  const [childCount, setChildren] = useState(Number(children));
  const [roomCount, setRoom] = useState(Number(room));

  const router = useLoadingRouter();
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const handleRoomChange = (delta: number) =>
    setRoom((prev) => Math.max(1, prev + delta));
  const handleAdultChange = (delta: number) =>
    setAdults((prev) => Math.max(1, prev + delta));
  const handleChildrenChange = (delta: number) =>
    setChildren((prev) => Math.max(0, prev + delta));
  const handleRegionChange = (newRegion: string) => {
    setNewRegion(newRegion);
  };
  const handleAccommodationTypeChange = (newType: string) => {
    setNewAccommodationType(newType);
  };

  const handleSearch = () => {
    const query = new URLSearchParams({
      region: newRegion,
      accommodationType: newAccommodationType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      room: String(roomCount),
      adults: String(adultCount),
      children: String(childCount),
      sort: selectedSort,
    }).toString();

    router.push(`/${locale}/list/lodge?${query}`);
  };

  const { data: lodges, isLoading } = useGetAvailableLodgeQuery({
    region,
    accommodationType,
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);
    const newQuery = new URLSearchParams({
      region,
      accommodationType,
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
    <div className="relative min-h-screen bg-gray-50 py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="relative z-50">
          <ReservationSearchBox
            region={newRegion}
            setRegion={handleRegionChange}
            accommodationType={newAccommodationType}
            setAccommodationType={handleAccommodationTypeChange}
            checkIn={checkInDate}
            setCheckIn={setCheckIn}
            checkOut={checkOutDate}
            setCheckOut={setCheckOut}
            dateRange={dateRange}
            setDateRange={setDateRange}
            calendar={calendar}
            setCalendar={setCalendar}
            isActive={isActive}
            setIsActive={setIsActive}
            adults={adultCount}
            setAdults={setAdults}
            room={roomCount}
            setRoom={setRoom}
            children={childCount}
            setChildren={setChildren}
            handleAdultChange={handleAdultChange}
            handleRoomChange={handleRoomChange}
            handleChildrenChange={handleChildrenChange}
            handleSearch={handleSearch}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("resultsCount", { count: lodges ? lodges.length : 0 })}
            </h1>

            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="sort" className="sr-only">
                {t("sortLabel")}
              </label>

              <select
                id="sort"
                value={selectedSort}
                onChange={handleSortChange}
                aria-label={t("sortLabel")}
                className={`
          h-9 text-sm border border-gray-300 rounded-lg
          px-2 md:px-3 bg-white text-gray-700
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          w-auto min-w-[9.5rem] md:min-w-[14rem]
        `}
              >
                <option value="popularity">{t("sort.popularity")}</option>
                <option value="reviews">{t("sort.reviews")}</option>
                <option value="price_asc">{t("sort.price_asc")}</option>
                <option value="price_desc">{t("sort.price_desc")}</option>
              </select>
            </div>
          </div>
        </div>

        {lodges?.length === 0 ? (
          <p className="text-base sm:text-lg text-gray-600 text-center">
            {t("noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {lodges?.map((lodge: Lodge) => {
              const lodgeName = getLocalizedLodgeName(lodge, i18n.language);
              return (
                <article
                  key={lodge.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500"
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => handleLodgeClick(lodge.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLodgeClick(lodge.id);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={t("selectLodge", {
                      name: lodgeName || lodge.name,
                    })}
                  >
                    <div className="relative w-full overflow-hidden bg-gray-100">
                      <div className="aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9]">
                        {lodge.images?.[0]?.imageUrl ? (
                          <img
                            src={lodge.images[0].imageUrl}
                            alt={lodgeName || lodge.name}
                            loading="lazy"
                            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                            {t("noImage")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2">
                        {lodgeName}
                      </h2>

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-yellow-600">
                          ⭐ {lodge.averageRating?.toFixed(1) ?? "0.0"}
                        </span>
                        <span className="text-gray-600">
                          {t("reviewsCount", { count: lodge.reviewCount ?? 0 })}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {t("region", { address: lodge.address })}
                      </p>

                      {lodge.roomTypes?.length ? (
                        <div className="space-y-2">
                          {lodge.roomTypes.map((room: RoomType) => {
                            const roomName = getLocalizedRoom(
                              room,
                              i18n.language
                            ).localizedName;
                            return (
                              <div
                                key={room.id}
                                className="border border-gray-200 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                              >
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {roomName}
                                </p>
                                <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600">
                                  <p>
                                    {t("maxAdults", { count: room.maxAdults })}
                                  </p>
                                  <p>
                                    {t("maxChildren", {
                                      count: room.maxChildren,
                                    })}
                                  </p>
                                  <p className="col-span-2 sm:col-span-1">
                                    {t("pricePerNight", {
                                      price:
                                        room.pricePerNight?.toLocaleString(),
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        )}
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
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
