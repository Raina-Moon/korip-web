"use client";

import React, { useState } from "react";
import Image from "next/image";
import "react-calendar/dist/Calendar.css";
import { useAppDispatch } from "@/lib/store/hooks";
import { showLoading } from "@/lib/store/loadingSlice";
import CheckinInput from "@/components/CheckInInput";
import TicketDateInput from "@/components/TicketDateInput";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import toast from "react-hot-toast";
import { useLoadingRouter } from "@/utils/useLoadingRouter";
import { useGetAllNewsQuery } from "@/lib/news/newsApi";
import { useGetAllEventsQuery } from "@/lib/events/eventsApi";
import { getLocalizedField } from "@/utils/getLocalizedField";

const Page = () => {
  const { t } = useTranslation("page");
  const [range, setRange] = useState<[Date, Date] | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [region, setRegion] = useState("전체");
  const [accommodationType, setAccommodationType] = useState("전체");
  const [room, setRoom] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [productType, setProductType] = useState<"숙박" | "티켓">("숙박");
  const [isNavigating, setIsNavigating] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const router = useLoadingRouter();
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const { data: newsData, isLoading: isNewsLoading } = useGetAllNewsQuery({
    page: 1,
    limit: 5,
  });
  const { data: eventsData, isLoading: isEventsLoading } = useGetAllEventsQuery(
    {
      page: 1,
      limit: 5,
    }
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleRoomChange = (delta: number) => {
    setRoom((prev) => Math.max(1, prev + delta));
  };

  const handleAdultChange = (delta: number) => {
    setAdults((prev) => Math.max(1, prev + delta));
  };

  const handleChildrenChange = (delta: number) => {
    setChildren((prev) => Math.max(0, prev + delta));
  };

  const handleSearch = () => {
    dispatch(showLoading());
    setIsNavigating(true);

    if (productType === "숙박") {
      if (!range || !range[0] || !range[1]) {
        toast.error(t("selectCheckinCheckoutWarning"));
        setIsNavigating(false);
        return;
      }

      const query = new URLSearchParams({
        region: region.slice(0, 2),
        checkIn: formatDate(range[0]),
        checkOut: formatDate(range[1]),
        roomCount: room.toString(),
        adults: adults.toString(),
        children: children.toString(),
        accommodationType,
      });

      router.push(`/${locale}/list/lodge?${query.toString()}`);
    } else {
      if (!date) {
        toast.error(t("selectDateWarning"));
        setIsNavigating(false);
        return;
      }

      const query = new URLSearchParams({
        region: region.slice(0, 2),
        date: formatDate(date),
        adults: adults.toString(),
        children: children.toString(),
      });

      router.push(`/${locale}/list/ticket?${query.toString()}`);
    }
  };

  if (isNavigating) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] sm:h-[60vh]">
        <Image
          src="/images/hero_section.webp"
          alt="Hero Section"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
              {t("welcome")}
            </h1>
            <p className="text-white/80 text-md px-3 sm:text-xl">
              {t("greeting_part1")}
              <br className="block md:hidden" />
              {t("greeting_part2")}
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="relative z-10 -mt-20 mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Product Type Toggle */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setProductType("숙박")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-300 ${
                productType === "숙박"
                  ? "bg-primary-800 text-white"
                  : "bg-white text-primary-800 border-primary-800"
              }`}
            >
              <i className="bi bi-building"></i>
              {t("accommodation")}
            </button>
            <button
              onClick={() => setProductType("티켓")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-300 ${
                productType === "티켓"
                  ? "bg-primary-800 text-white"
                  : "bg-white text-primary-800 border-primary-800"
              }`}
            >
              <i className="bi bi-ticket-perforated-fill"></i>
              {t("ticket")}
            </button>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            {productType === "숙박" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-900">
                      {t("selectRegion")}
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="mt-1 w-full border border-primary-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="전체">{t("all")}</option>
                      <option value="서울">{t("seoul")}</option>
                      <option value="부산">{t("busan")}</option>
                      <option value="경기">{t("gyeonggi")}</option>
                      <option value="충청">{t("chungcheong")}</option>
                      <option value="전라">{t("jeolla")}</option>
                      <option value="경상">{t("gyeongsang")}</option>
                      <option value="제주">{t("jeju")}</option>
                      <option value="강원">{t("gangwon")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900">
                      {t("accommodationType")}
                    </label>
                    <select
                      value={accommodationType}
                      onChange={(e) => setAccommodationType(e.target.value)}
                      className="mt-1 w-full border border-primary-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="All">{t("allAccommodationTypes")}</option>
                      <option value="호텔">{t("hotel")}</option>
                      <option value="모텔">{t("motel")}</option>
                      <option value="리조트">{t("resort")}</option>
                      <option value="펜션">{t("pension")}</option>
                      <option value="기타">{t("etc")}</option>
                    </select>
                  </div>
                </div>

                <CheckinInput range={range} setRange={setRange} />

                <div>
                  <label className="block text-sm font-medium text-primary-900">
                    {t("checkoutDate")}
                  </label>
                  <input
                    className="mt-1 w-full border border-primary-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    readOnly
                    value={formatDate(range?.[1] ?? null)}
                    placeholder={t("checkoutDatePlaceholder")}
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className="w-full border border-primary-800 rounded-md px-4 py-2 flex justify-between items-center hover:bg-primary-50 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium text-primary-900">
                      {t("roomAndGuestSelection")}
                    </span>
                    <span className="flex gap-2">
                      <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs">
                        {t("room")} {room}
                      </span>
                      <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs">
                        {t("adults")} {adults}
                      </span>
                      <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs">
                        {t("children")} {children}
                      </span>
                    </span>
                  </button>

                  {isActive && (
                    <div
                      className="absolute right-0 top-full mt-2 w-full sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 animate-dropdown"
                      onMouseEnter={() => {
                        if (hoverTimeout) clearTimeout(hoverTimeout);
                        setIsActive(true);
                      }}
                      onMouseLeave={() => {
                        const timeout = setTimeout(
                          () => setIsActive(false),
                          200
                        );
                        setHoverTimeout(timeout);
                      }}
                    >
                      <div className="flex justify-end mb-3">
                        <button
                          onClick={() => setIsActive(false)}
                          className="text-primary-600 hover:text-primary-700 text-lg font-semibold"
                          aria-label={t("closeDropdown")}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {t("room")}
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleRoomChange(-1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 disabled:opacity-50"
                              aria-label={t("decreaseRoomCount")}
                              disabled={room <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <p className="text-sm text-gray-700 w-6 text-center">
                              {room}
                            </p>
                            <button
                              onClick={() => handleRoomChange(1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200"
                              aria-label={t("increaseRoomCount")}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {t("adults")}
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleAdultChange(-1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 disabled:opacity-50"
                              aria-label={t("decreaseAdultCount")}
                              disabled={adults <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <p className="text-sm text-gray-700 w-6 text-center">
                              {adults}
                            </p>
                            <button
                              onClick={() => handleAdultChange(1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200"
                              aria-label={t("increaseAdultCount")}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {t("children")}
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleChildrenChange(-1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 disabled:opacity-50"
                              aria-label={t("decreaseChildrenCount")}
                              disabled={children <= 0}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <p className="text-sm text-gray-700 w-6 text-center">
                              {children}
                            </p>
                            <button
                              onClick={() => handleChildrenChange(1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200"
                              aria-label={t("increaseChildrenCount")}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {productType === "티켓" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-primary-900">
                    {t("selectRegion")}
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="mt-1 w-full border border-primary-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="전체">{t("all")}</option>
                    <option value="서울">{t("seoul")}</option>
                    <option value="부산">{t("busan")}</option>
                    <option value="경기">{t("gyeonggi")}</option>
                    <option value="충청">{t("chungcheong")}</option>
                    <option value="전라">{t("jeolla")}</option>
                    <option value="경상">{t("gyeongsang")}</option>
                    <option value="제주">{t("jeju")}</option>
                    <option value="강원">{t("gangwon")}</option>
                  </select>
                </div>

                <TicketDateInput date={date} setDate={setDate} />

                <div className="relative">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className="w-full border border-primary-800 rounded-md px-4 py-2 flex justify-between items-center hover:bg-primary-50 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium text-primary-900">
                      {t("guestSelection")}
                    </span>
                    <span className="flex gap-2">
                      <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs">
                        {t("adults")} {adults}
                      </span>
                      <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs">
                        {t("children")} {children}
                      </span>
                    </span>
                  </button>

                  {isActive && (
                    <div
                      className="absolute right-0 top-full mt-2 w-full sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 animate-dropdown"
                      onMouseEnter={() => {
                        if (hoverTimeout) clearTimeout(hoverTimeout);
                        setIsActive(true);
                      }}
                      onMouseLeave={() => {
                        const timeout = setTimeout(
                          () => setIsActive(false),
                          200
                        );
                        setHoverTimeout(timeout);
                      }}
                    >
                      <div className="flex justify-end mb-3">
                        <button
                          onClick={() => setIsActive(false)}
                          className="text-primary-600 hover:text-primary-700 text-lg font-semibold"
                          aria-label={t("closeDropdown")}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {t("adults")}
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleAdultChange(-1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 disabled:opacity-50"
                              aria-label={t("decreaseAdultCount")}
                              disabled={adults <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <p className="text-sm text-gray-700 w-6 text-center">
                              {adults}
                            </p>
                            <button
                              onClick={() => handleAdultChange(1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200"
                              aria-label={t("increaseAdultCount")}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {t("children")}
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleChildrenChange(-1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 disabled:opacity-50"
                              aria-label={t("decreaseChildrenCount")}
                              disabled={children <= 0}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <p className="text-sm text-gray-700 w-6 text-center">
                              {children}
                            </p>
                            <button
                              onClick={() => handleChildrenChange(1)}
                              className="w-8 h-8 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200"
                              aria-label={t("increaseChildrenCount")}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              onClick={handleSearch}
              className="w-full bg-primary-800 text-white py-2 rounded-md hover:bg-primary-700 transition-colors duration-300"
            >
              <i className="bi bi-search mr-2"></i>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* News and Events Section */}
      <div className="container mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* News Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-primary-800 text-2xl font-bold">News</h2>
              <button
                onClick={() => router.push(`/${locale}/news/list`)}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
              >
                {t("seeMore")}
                <i className="bi bi-chevron-right ml-1"></i>
              </button>
            </div>
            <div className="border-b-2 border-primary-800 mb-4"></div>
            {isNewsLoading ? (
              <p className="text-gray-600">{t("loading")}</p>
            ) : (
              <ul className="space-y-4">
                {newsData?.items?.slice(0, 5).map((news) => (
                  <li key={news.id} className="border-b border-gray-200 pb-2">
                    <button
                      onClick={() => router.push(`/${locale}/news/${news.id}`)}
                      className="text-left text-primary-900 hover:text-primary-600 transition-colors duration-200"
                    >
                      <p className="text-sm font-medium">
                        {getLocalizedField(news.title, news.titleEn, locale)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(news.createdAt).toLocaleDateString(locale)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Events Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-primary-800 text-2xl font-bold">Events</h2>
              <button
                onClick={() => router.push(`/${locale}/events/list`)}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
              >
                {t("seeMore")}
                <i className="bi bi-chevron-right ml-1"></i>
              </button>
            </div>
            <div className="border-b-2 border-primary-800 mb-4"></div>
            {isEventsLoading ? (
              <p className="text-gray-600">{t("loading")}</p>
            ) : (
              <ul className="space-y-4">
                {eventsData?.items?.slice(0, 5).map((event) => (
                  <li key={event.id} className="border-b border-gray-200 pb-2">
                    <button
                      onClick={() =>
                        router.push(`/${locale}/events/${event.id}`)
                      }
                      className="text-left text-primary-900 hover:text-primary-600 transition-colors duration-200"
                    >
                      <p className="text-sm font-medium">
                        {getLocalizedField(event.title, event.titleEn, locale)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(event.createdAt).toLocaleDateString(locale)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
