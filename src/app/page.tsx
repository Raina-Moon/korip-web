"use client";

import React, { useState } from "react";
import Image from "next/image";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation";

const page = () => {
  const [calendar, setCalendar] = useState(false);
  const [range, setRange] = useState<[Date, Date] | null>(null);
  const [region, setRegion] = useState("All");
  const [room, setRoom] = useState(1);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();

  const formatDate = (date: Date | null) => {
    return date ? date.toISOString().split("T")[0] : "";
  };

  const handleRoomChange = (delta: number) => {
    setRoom((prev) => Math.max(1, prev + delta));
  };

  const handleAdultChange = (delta: number) => {
    setAdult((prev) => Math.max(1, prev + delta));
  };

  const handleChildrenChange = (delta: number) => {
    setChildren((prev) => Math.max(0, prev + delta));
  };

  const handleSearch = () => {
    if (!range || !range[0] || !range[1]) {
            alert("Please select a check-in and check-out date.");
            return;
          }

          const query = new URLSearchParams({
            region,
            checkIn: formatDate(range[0]),
            checkOut: formatDate(range[1]),
            room: room.toString(),
            adult: adult.toString(),
            children: children.toString(),
          })

          router.push(`/search?${query.toString()}`);
  }

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
        className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-[60%] h-[300px] bg-white rounded-lg shadow-lg 
                flex flex-col items-center justify-center gap-5 px-5"
      >
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-primary-800 rounded-md outline-none px-3 py-1"
        >
          <option value="All">All Regions</option>
          <option value="Seoul">Seoul</option>
          <option value="Busan">Busan</option>
          <option value="Gyeonggi-do">Gyeonggi-do</option>
          <option value="Chungcheong-do">Chungcheong-do</option>
          <option value="Jeolla-do">Jeolla-do</option>
          <option value="Gyeongsang-do">Gyeongsang-do</option>
          <option value="Jeju-do">Jeju-do</option>
          <option value="Gangwon-do">Gangwon-do</option>
        </select>
        <input
          className="border border-primary-800 rounded-md outline-none px-3 py-1"
          readOnly
          onClick={() => {
            setCalendar(true);
            setRange(null);
          }}
          value={formatDate(range?.[0] ?? null)}
          placeholder="Check-in Date"
        />
        <input
          className="border border-primary-800 rounded-md outline-none px-3 py-1"
          readOnly
          onClick={() => {
            setCalendar(true);
            setRange(null);
          }}
          value={formatDate(range?.[1] ?? null)}
          placeholder="Check-out Date"
        />
        <div
          onClick={() => setIsActive(!isActive)}
          className="flex flex-row border-primary-800 border rounded-md px-3 py-1 gap-2"
        >
          <p>Room : {room}</p>
          <p>Adult : {adult}</p>
          <p>Children : {children}</p>
        </div>
        <button 
        onClick={handleSearch}
        className="bg-primary-800 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors duration-300">
          Search
        </button>
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

      {calendar && (
        <>
          <Calendar
            calendarType="gregory"
            onChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                setRange(value as [Date, Date]);
                setCalendar(false);
              }
            }}
            selectRange
            showDoubleView
            value={range}
            minDate={new Date()}
          />
        </>
      )}

      {isActive && (
        <>
          <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-primary-300 p-4 z-50">
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
              <p className="text-lg text-primary-900 font-semibold"> {adult}</p>
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
  );
};

export default page;
