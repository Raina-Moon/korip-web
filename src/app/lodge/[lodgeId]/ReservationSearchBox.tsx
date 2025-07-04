"use client";

import React from "react";
import Calendar from "react-calendar";

interface ReservationSearchBoxProps {
  checkIn: string;
  setCheckIn: (value: string) => void;
  checkOut: string;
  setCheckOut: (value: string) => void;
  dateRange: [Date, Date] | null;
  setDateRange: (range: [Date, Date] | null) => void;
  calendar: boolean;
  setCalendar: (open: boolean) => void;
  isActive: boolean;
  setIsActive: (open: boolean) => void;
  adults: number;
  setAdults: (value: number) => void;
  room: number;
  setRoom: (value: number) => void;
  children: number;
  setChildren: (value: number) => void;
  handleAdultChange: (delta: number) => void;
  handleRoomChange: (delta: number) => void;
  handleChildrenChange: (delta: number) => void;
  handleSearch: () => void;
}


export default function ReservationSearchBox({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  dateRange,
  setDateRange,
  calendar,
  setCalendar,
  isActive,
  setIsActive,
  adults,
  setAdults,
  room,
  setRoom,
  children,
  setChildren,
  handleAdultChange,
  handleRoomChange,
  handleChildrenChange,
  handleSearch,
}: ReservationSearchBoxProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg relative flex flex-row items-center justify-center gap-5 px-5 py-5 mt-5 mb-8">
      <input
        className="border border-primary-800 rounded-md outline-none px-3 py-1"
        readOnly
        onClick={() => setCalendar(true)}
        value={formatDate(dateRange?.[0] ?? null)}
        placeholder="Check-in Date"
      />
      <input
        className="border border-primary-800 rounded-md outline-none px-3 py-1"
        readOnly
        onClick={() => setCalendar(true)}
        value={formatDate(dateRange?.[1] ?? null)}
        placeholder="Check-out Date"
      />

      {calendar && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 z-50">
          <Calendar
            calendarType="gregory"
            onChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                setDateRange(value as [Date, Date]);
                setCheckIn(formatDate(value[0]));
                setCheckOut(formatDate(value[1]));
                setCalendar(false);
              }
            }}
            selectRange
            showDoubleView
            value={dateRange}
            minDate={new Date()}
          />
        </div>
      )}

      <div
        onClick={() => setIsActive(!isActive)}
        className="flex flex-row border-primary-800 border rounded-md px-3 py-1 gap-2 cursor-pointer"
      >
        <p>Room : {room}</p>
        <p>Adult : {adults}</p>
        <p>Children : {children}</p>
      </div>
      <button
        className="bg-primary-700 text-white px-4 py-1 rounded-md hover:bg-primary-500"
        onClick={handleSearch}
      >
        검색
      </button>

      {isActive && (
        <div className="absolute left-2/3 top-14 mt-2 bg-white shadow-lg rounded-lg border border-primary-300 p-4 z-50">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setIsActive(false)}
              className="text-primary-900 font-bold text-xl hover:text-primary-500"
            >
              X
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <QuantitySelector
              label="Room"
              value={room}
              onChange={handleRoomChange}
            />
            <QuantitySelector
              label="Adult"
              value={adults}
              onChange={handleAdultChange}
            />
            <QuantitySelector
              label="Children"
              value={children}
              onChange={handleChildrenChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const QuantitySelector = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (delta: number) => void;
}) => (
  <div className="flex flex-row items-center justify-center p-5 gap-4">
    <p className="text-lg font-semibold text-primary-900">{label}</p>
    <button
      onClick={() => onChange(-1)}
      className="border border-primary-800 p-3 rounded-full text-2xl"
    >
      -
    </button>
    <p className="text-lg text-primary-900 font-semibold">{value}</p>
    <button
      onClick={() => onChange(1)}
      className="border border-primary-800 p-3 rounded-full text-2xl"
    >
      +
    </button>
  </div>
);
