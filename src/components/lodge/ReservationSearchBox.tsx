"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";

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
  room,
  children,
  handleAdultChange,
  handleRoomChange,
  handleChildrenChange,
  handleSearch,
}: ReservationSearchBoxProps) {
  const { t } = useTranslation("lodge");
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col w-full sm:w-80">
          <label
            htmlFor="checkIn"
            className="text-sm font-medium text-gray-900 mb-1"
          >
            {t("checkInPlaceholder")}
          </label>
          <input
            id="checkIn"
            className="h-10 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            readOnly
            onClick={() => setCalendar(true)}
            value={formatDate(dateRange?.[0] ?? null)}
            placeholder={t("checkInPlaceholder")}
            aria-label={t("checkInPlaceholder")}
          />
        </div>
        <div className="flex flex-col w-full sm:w-80">
          <label
            htmlFor="checkOut"
            className="text-sm font-medium text-gray-900 mb-1"
          >
            {t("checkOutPlaceholder")}
          </label>
          <input
            id="checkOut"
            className="h-10 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            readOnly
            onClick={() => setCalendar(true)}
            value={formatDate(dateRange?.[1] ?? null)}
            placeholder={t("checkOutPlaceholder")}
            aria-label={t("checkOutPlaceholder")}
          />
        </div>
        <div className="flex flex-col w-full sm:w-80 relative">
          <label
            htmlFor="guests"
            className="text-sm font-medium text-gray-900 mb-1"
          >
            {t("guests")}
          </label>
          <button
            id="guests"
            onClick={() => setIsActive(!isActive)}
            className="h-10 border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 w-full group"
            aria-label={t("guests")}
          >
            <span className="flex gap-2">
              <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-sm font-medium">
                {t("room")} {room}
              </span>
              <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-sm font-medium">
                {t("adult")} {adults}
              </span>
              <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-sm font-medium">
                {t("children")} {children}
              </span>
            </span>
          </button>
          {isActive && (
            <div
              className="absolute left-0 top-full mt-2 w-full sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 animate-dropdown group"
              onMouseEnter={() => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
                setIsActive(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setIsActive(false), 200);
                setHoverTimeout(timeout);
              }}
            >
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => setIsActive(false)}
                  className="text-primary-600 hover:text-primary-700 text-lg font-semibold transition-colors duration-200"
                  aria-label={t("closeDropdown")}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <div className="space-y-4">
                <QuantitySelector
                  label={t("room")}
                  value={room}
                  onChange={handleRoomChange}
                  min={1}
                />
                <QuantitySelector
                  label={t("adult")}
                  value={adults}
                  onChange={handleAdultChange}
                  min={1}
                />
                <QuantitySelector
                  label={t("children")}
                  value={children}
                  onChange={handleChildrenChange}
                  min={0}
                />
              </div>
            </div>
          )}
        </div>
        <button
          className="h-10 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 w-full sm:w-auto"
          onClick={handleSearch}
          aria-label={t("search")}
        >
          <i className="bi bi-search mr-2"></i>
          {t("search")}
        </button>
      </div>

      {calendar && (
        <div
          className="absolute left-0 top-[8.5rem] sm:top-[7rem] mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 animate-dropdown group w-full sm:w-[49.5rem]"
          onMouseEnter={() => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
            setCalendar(true);
          }}
          onMouseLeave={() => {
            const timeout = setTimeout(() => setCalendar(false), 200);
            setHoverTimeout(timeout);
          }}
        >
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

      <style jsx>{`
        @keyframes dropdown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

const QuantitySelector = ({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: number;
  onChange: (delta: number) => void;
  min: number;
}) => {
  const { t } = useTranslation("lodge");

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(-1)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          aria-label={t("decrease", { label })}
          disabled={value <= min}
        >
          <i className="bi bi-dash text-lg"></i>
        </button>
        <p className="text-sm font-medium text-gray-700 w-8 text-center">
          {value}
        </p>
        <button
          onClick={() => onChange(1)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          aria-label={t("increase", { label })}
        >
          <i className="bi bi-plus text-lg"></i>
        </button>
      </div>
    </div>
  );
};