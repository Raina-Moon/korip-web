"use client";

import React, { useState } from "react";
import Image from "next/image";
import Calendar from "react-calendar";

const page = () => {
  const [calendar, setCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
        <input className="border border-primary-800 rounded-md outline-none px-3 py-1" />
        <input 
        className="border border-primary-800 rounded-md outline-none px-3 py-1"
        type="date"
        onClick={() => setCalendar(!calendar)}
        />
        <button className="bg-primary-800 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors duration-300">
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
        onChange={(value) => {
          if (value instanceof Date) {
            setDate(value);
          } else if (Array.isArray(value) && value[0] instanceof Date) {
            setDate(value[0]);
          }
        }}
        value={date}
        />
        </>
      )}
    </div>
  );
};

export default page;
