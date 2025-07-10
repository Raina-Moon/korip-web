"use client";

import React, { useState } from "react";
import Image from "next/image";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { showLoading } from "@/lib/store/loadingSlice";
import CheckinInput from "@/components/CheckInInput";

const page = () => {
  const [calendar, setCalendar] = useState(false);
  const [range, setRange] = useState<[Date, Date] | null>(null);
  const [region, setRegion] = useState("전체");
  const [accommodationType, setAccommodationType] = useState("전체");
  const [room, setRoom] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [productType, setProductType] = useState<"숙박" | "티켓">("숙박");

  const router = useRouter();
  const dispatch = useAppDispatch();

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
    if (!range || !range[0] || !range[1]) {
      alert("Please select a check-in and check-out date.");
      return;
    }

    dispatch(showLoading());

    const query = new URLSearchParams({
      region: region.slice(0, 2),
      checkIn: formatDate(range[0]),
      checkOut: formatDate(range[1]),
      roomCount: room.toString(),
      adults: adults.toString(),
      children: children.toString(),
      accommodationType,
    });

    router.push(`/list?${query.toString()}`);
  };

  return (
    <div className="h-screen">
      <div className="relative w-full h-[60vh]">
        <Image
          src="/images/hero_section.jpg"
          alt="Hero Section"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center">
          <div className="flex flex-col items-center gap-5">
            <p className="text-white font-semibold text-3xl">
              당신의 일상에 따뜻한 쉼표를
            </p>
            <p className="text-white/70 text-xl">
              전국 온천을 간편하게 예약하고, 지친 몸과 마음을 녹여보세요.
            </p>
          </div>
        </div>
      </div>

      <div
        className="
    absolute 
    top-[58vh] 
    left-1/2 
    -translate-x-1/2 
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
            숙박
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
            티켓
          </button>
        </div>

        <div className="flex flex-col items-center w-full max-w-2xl gap-4">
          <div className="flex w-full gap-4">
            <label className="flex flex-col flex-1 w-full max-w-xs text-primary-900 font-medium">
              지역 선택
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="mt-1 border border-primary-800 rounded-md outline-none px-3 py-2 w-full"
              >
                <option value="전체">전체</option>
                <option value="서울">서울</option>
                <option value="부산">부산</option>
                <option value="경기">경기도</option>
                <option value="충청">충청도</option>
                <option value="전라">전라도</option>
                <option value="경상">경상도</option>
                <option value="제주">제주도</option>
                <option value="강원">강원도</option>
              </select>
            </label>

            <label className="flex flex-col flex-1 text-primary-900 font-medium">
              숙소 유형
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
                className="mt-1 border border-primary-800 rounded-md outline-none px-3 py-2 w-full"
              >
                <option value="All">숙소 유형 전체</option>
                <option value="호텔">호텔</option>
                <option value="모텔">모텔</option>
                <option value="리조트">리조트</option>
                <option value="펜션">펜션</option>
                <option value="기타">기타</option>
              </select>
            </label>
          </div>

          <CheckinInput range={range} setRange={setRange} />

          <label className="flex flex-col w-full text-primary-900 font-medium">
            체크아웃 날짜
            <input
              className="mt-1 border border-primary-800 rounded-md outline-none px-3 py-2 w-full"
              readOnly
              onClick={() => {
                setCalendar(true);
              }}
              value={formatDate(range?.[1] ?? null)}
              placeholder="Check-out Date"
            />
          </label>

          <div
            onClick={() => setIsActive(!isActive)}
            className="flex flex-row border-primary-800 border rounded-md px-3 py-1 gap-2"
          >
            <p>Room : {room}</p>
            <p>Adult : {adults}</p>
            <p>Children : {children}</p>
          </div>

          <button
            onClick={handleSearch}
            className="bg-primary-800 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors duration-300"
          >
            Search
          </button>
        </div>
        {isActive && (
          <>
            <div className="absolute top-64 mt-2 bg-white shadow-lg rounded-lg border border-primary-300 p-4 z-50">
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => setIsActive(false)}
                  className="text-primary-900 font-bold text-xl hover:text-primary-500"
                >
                  X
                </button>
              </div>
              <div className="flex flex-row items-center justify-center p-5 gap-4">
                <p className="text-lg font-semibold text-primary-900">Room </p>
                <button
                  onClick={() => handleRoomChange(-1)}
                  className="border border-primary-800 p-3 rounded-full text-2xl"
                >
                  -
                </button>
                <p className="text-lg text-primary-900 font-semibold">{room}</p>
                <button
                  onClick={() => handleRoomChange(1)}
                  className="border border-primary-800 p-3 rounded-full text-2xl"
                >
                  +
                </button>
              </div>
              <div className="flex flex-row items-center justify-center p-5 gap-4">
                <p className="text-lg font-semibold text-primary-900">Adult</p>
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
                  Children{" "}
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

      <div className="flex justify-between items-center mt-56 mb-20 px-5 w-[60%] gap-10">
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

export default page;
