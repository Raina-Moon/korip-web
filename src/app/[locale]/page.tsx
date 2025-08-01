"use client";

import React, { useState } from "react";
import Image from "next/image";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { showLoading } from "@/lib/store/loadingSlice";
import CheckinInput from "@/components/CheckInInput";
import TicketDateInput from "@/components/TicketDateInput";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/utils/useLocale";
import toast from "react-hot-toast";

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
  const [isNavigationg, setIsNavigating] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const locale = useLocale();

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

  if (isNavigationg) return null;

  return (
    <div className="h-screen">
      <div className="relative w-full h-[60vh] z-0">
        <Image
          src="/images/hero_section.webp"
          alt="Hero Section"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center z-10">
          <div className="flex flex-col items-center gap-5">
            <p className="text-white font-semibold text-3xl">{t("welcome")}</p>
            <p className="text-white/70 text-xl">
              {t("greeting", { name: "User" })}
            </p>
          </div>
        </div>
      </div>

      <div
        className="
   relative
    z-50
    mt-[-110px]
    mx-auto
    w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]
    bg-white
    rounded-lg
    shadow-lg
    flex flex-col items-center justify-center
    gap-5
    px-5
    py-6
    min-h-[300px]
    sm:min-h-[320px]
    md:min-h-[340px]
    lg:min-h-[360px]
  "
      >
        <div className="flex justify-center items-center mt-3 gap-4">
          <button
            onClick={() => setProductType("숙박")}
            className={`px-6 py-2 rounded-full border ${
              productType === "숙박"
                ? "bg-primary-800 text-white"
                : "bg-white text-primary-800"
            } transition-colors duration-300`}
          >
            <i className="bi bi-building mr-2"></i>
            {t("accommodation")}
          </button>
          <button
            onClick={() => setProductType("티켓")}
            className={`px-6 py-2 rounded-full border ${
              productType === "티켓"
                ? "bg-primary-800 text-white"
                : "bg-white text-primary-800"
            } transition-colors duration-300`}
          >
            <i className="bi bi-ticket-perforated-fill mr-2"></i>
            {t("ticket")}
          </button>
        </div>

        <div className="flex flex-col items-center w-full max-w-2xl gap-4">
          {productType === "숙박" && (
            <>
              <div className="flex w-full gap-4">
                <label className="flex flex-col flex-1 w-full max-w-xs text-primary-900 font-medium">
                  {t("selectRegion")}
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="mt-1 border border-primary-800 rounded-md outline-none px-3 py-2 w-full"
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
                </label>

                <label className="flex flex-col flex-1 text-primary-900 font-medium">
                  {t("accommodationType")}
                  <select
                    value={accommodationType}
                    onChange={(e) => setAccommodationType(e.target.value)}
                    className="mt-1 border border-primary-800 rounded-md outline-none px-3 py-2 w-full"
                  >
                    <option value="All">{t("allAccommodationTypes")}</option>
                    <option value="호텔">{t("hotel")}</option>
                    <option value="모텔">{t("motel")}</option>
                    <option value="리조트">{t("resort")}</option>
                    <option value="펜션">{t("pension")}</option>
                    <option value="기타">{t("etc")}</option>
                  </select>
                </label>
              </div>

              <CheckinInput range={range} setRange={setRange} />

              <label className="flex flex-col w-full text-primary-900 font-medium">
                {t("checkoutDate")}
                <input
                  className="mt-1 border border-primary-800 rounded-md outline-none px-3 py-2 w-full"
                  readOnly
                  value={formatDate(range?.[1] ?? null)}
                  placeholder={t("checkoutDatePlaceholder")}
                />
              </label>

              <div className="w-full relative">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="
    w-full
    border border-primary-800
    rounded-md
    px-3
    py-2
    flex
    justify-between
    items-center
    hover:bg-primary-50
    transition-colors
    duration-200
    my-2
  "
                >
                  <span className="text-primary-900 font-medium">
                    {t("roomAndGuestSelection")}
                  </span>
                  <span className="flex gap-2">
                    <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-sm">
                      {t("room")} {room}
                    </span>
                    <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-sm">
                      {t("adults")} {adults}
                    </span>
                    <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-sm">
                      {t("children")} {children}
                    </span>
                  </span>
                </button>

                {isActive && (
                  <>
                    <div className="absolute left-2/3 top-3/4 mt-2 bg-white shadow-lg rounded-lg border border-primary-300 p-4 z-50">
                      <div className="flex justify-end mb-3">
                        <button
                          onClick={() => setIsActive(false)}
                          className="text-primary-900 font-bold text-xl hover:text-primary-500"
                        >
                          X
                        </button>
                      </div>
                      <div className="flex flex-row items-center justify-center p-5 gap-4">
                        <p className="text-lg font-semibold text-primary-900">
                          {t("room")}{" "}
                        </p>
                        <button
                          onClick={() => handleRoomChange(-1)}
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                        >
                          -
                        </button>
                        <p className="text-lg text-primary-900 font-semibold">
                          {room}
                        </p>
                        <button
                          onClick={() => handleRoomChange(1)}
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-row items-center justify-center p-5 gap-4">
                        <p className="text-lg font-semibold text-primary-900">
                          {t("adults")}
                        </p>
                        <button
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                          onClick={() => handleAdultChange(-1)}
                        >
                          -
                        </button>
                        <p className="text-lg text-primary-900 font-semibold">
                          {" "}
                          {adults}
                        </p>
                        <button
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                          onClick={() => handleAdultChange(1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-row items-center justify-center p-5 gap-4">
                        <p className="text-lg font-semibold text-primary-900">
                          {t("children")}{" "}
                        </p>
                        <button
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                          onClick={() => handleChildrenChange(-1)}
                        >
                          -
                        </button>
                        <p className="text-lg text-primary-900 font-semibold">
                          {" "}
                          {children}
                        </p>
                        <button
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                          onClick={() => handleChildrenChange(1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {productType === "티켓" && (
            <>
              <label className="flex flex-col w-full max-w-xs text-primary-900 font-medium">
                {t("selectRegion")}
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="mt-1 border border-primary-800 rounded-md outline-none px-3 py-2 w-full"
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
              </label>

              <TicketDateInput date={date} setDate={setDate} />

              <div className="w-full relative">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="
    w-full
    border border-primary-800
    rounded-md
    px-3
    py-2
    flex
    justify-between
    items-center
    hover:bg-primary-50
    transition-colors
    duration-200
    my-2
  "
                >
                  <span className="text-primary-900 font-medium">
                    {t("guestSelection")}
                  </span>
                  <span className="flex gap-2">
                    <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-sm">
                      {t("adults")} {adults}
                    </span>
                    <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-sm">
                      {t("children")} {children}
                    </span>
                  </span>
                </button>

                {isActive && (
                  <>
                    <div className="absolute left-2/3 top-3/4 mt-2 bg-white shadow-lg rounded-lg border border-primary-300 p-4 z-50">
                      <div className="flex justify-end mb-3">
                        <button
                          onClick={() => setIsActive(false)}
                          className="text-primary-900 font-bold text-xl hover:text-primary-500"
                        >
                          X
                        </button>
                      </div>

                      <div className="flex flex-row items-center justify-center p-5 gap-4">
                        <p className="text-lg font-semibold text-primary-900">
                          {t("adults")}
                        </p>
                        <button
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                          onClick={() => handleAdultChange(-1)}
                        >
                          -
                        </button>
                        <p className="text-lg text-primary-900 font-semibold">
                          {" "}
                          {adults}
                        </p>
                        <button
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                          onClick={() => handleAdultChange(1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-row items-center justify-center p-5 gap-4">
                        <p className="text-lg font-semibold text-primary-900">
                          {t("children")}{" "}
                        </p>
                        <button
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                          onClick={() => handleChildrenChange(-1)}
                        >
                          -
                        </button>
                        <p className="text-lg text-primary-900 font-semibold">
                          {" "}
                          {children}
                        </p>
                        <button
                          className="border border-primary-800 p-3 rounded-full text-2xl"
                          onClick={() => handleChildrenChange(1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <button
            onClick={handleSearch}
            className="bg-primary-800 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors duration-300"
          >
            <i className="bi bi-search mr-2"></i>Search
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-20 mb-20 px-5 w-[60%] gap-10">
        <div className="border-b border-primary-800 w-full">
          <p className="text-primary-800 font-bold text-3xl">News</p>
        </div>

        <div className="border-b border-primary-800 w-full">
          <p className="text-primary-800 font-bold text-3xl">Events</p>
        </div>
      </div>

      <div>
        <p>page</p>
      </div>
    </div>
  );
};

export default Page;
