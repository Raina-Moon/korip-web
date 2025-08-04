"use client";

import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";

interface ReservationSearchBoxProps {
  region?: string;
  setRegion?: (value: string) => void;
  accommodationType?: string;
  setAccommodationType?: (value: string) => void;
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
  region,
  setRegion,
  accommodationType,
  setAccommodationType,
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
  const calendarRef = useRef<HTMLDivElement>(null);
  const guestDropdownRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (calendarRef.current && !calendarRef.current.contains(target)) {
        setCalendar(false);
      }

      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(target)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setCalendar, setIsActive]);

  const hasRegion = region !== undefined && setRegion !== undefined;
  const hasAccommodationType =
    accommodationType !== undefined && setAccommodationType !== undefined;
  const calendarWidthClass =
    hasRegion || hasAccommodationType ? "sm:w-[49.5rem]" : "sm:w-[37.5rem]";

  return (
    <div className="w-full max-w-[72rem] mx-auto bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 animate-fade-in">
      <div
        className="flex flex-row items-end gap-3 flex-nowrap"
        role="group"
        aria-label={t("searchForm")}
      >
        {hasRegion && (
          <div className="flex flex-col w-full sm:w-48">
            <label
              htmlFor="region"
              className="text-xs font-medium text-gray-900 mb-0.5 uppercase tracking-wide text-left"
            >
              {t("selectRegion")}
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-9 border border-gray-300 rounded-xl px-2 py-1.5 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all duration-200"
              aria-label={t("selectRegion")}
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
        )}
        {hasAccommodationType && (
          <div className="flex flex-col w-full sm:w-48">
            <label
              htmlFor="accommodationType"
              className="text-xs font-medium text-gray-900 mb-0.5 uppercase tracking-wide text-left"
            >
              {t("accommodationType")}
            </label>
            <select
              id="accommodationType"
              value={accommodationType}
              onChange={(e) => setAccommodationType(e.target.value)}
              className="h-9 border border-gray-300 rounded-xl px-2 py-1.5 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all duration-200"
              aria-label={t("accommodationType")}
            >
              <option value="All">{t("allAccommodationTypes")}</option>
              <option value="호텔">{t("hotel")}</option>
              <option value="모텔">{t("motel")}</option>
              <option value="리조트">{t("resort")}</option>
              <option value="펜션">{t("pension")}</option>
              <option value="기타">{t("etc")}</option>
            </select>
          </div>
        )}
        <div className="flex flex-col w-full sm:w-48">
          <label
            htmlFor="checkIn"
            className="text-xs font-medium text-gray-900 mb-0.5 uppercase tracking-wide text-left"
          >
            {t("checkInPlaceholder")}
          </label>
          <input
            id="checkIn"
            className="h-9 border border-gray-300 rounded-xl px-2 py-1.5 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all duration-200"
            readOnly
            onClick={() => setCalendar(true)}
            value={formatDate(dateRange?.[0] ?? null)}
            placeholder={t("checkInPlaceholder")}
            aria-label={t("checkInPlaceholder")}
          />
        </div>
        <div className="flex flex-col w-full sm:w-48">
          <label
            htmlFor="checkOut"
            className="text-xs font-medium text-gray-900 mb-0.5 uppercase tracking-wide text-left"
          >
            {t("checkOutPlaceholder")}
          </label>
          <input
            id="checkOut"
            className="h-9 border border-gray-300 rounded-xl px-2 py-1.5 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all duration-200"
            readOnly
            onClick={() => setCalendar(true)}
            value={formatDate(dateRange?.[1] ?? null)}
            placeholder={t("checkOutPlaceholder")}
            aria-label={t("checkOutPlaceholder")}
          />
        </div>
        <div className="flex flex-col w-full sm:w-48 relative">
          <label
            htmlFor="guests"
            className="text-xs font-medium text-gray-900 mb-0.5 uppercase tracking-wide text-left"
          >
            {t("guests")}
          </label>
          <button
            id="guests"
            onClick={() => setIsActive(!isActive)}
            className="h-9 border border-gray-300 rounded-xl px-2 py-1.5 text-sm text-gray-700 w-full bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all duration-200 flex justify-between items-center"
            aria-label={t("guests")}
          >
            <span className="flex gap-1.5">
              <span className="bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full text-xs font-medium">
                {t("room")} {room}
              </span>
              <span className="bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full text-xs font-medium">
                {t("adult")} {adults}
              </span>
              <span className="bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full text-xs font-medium">
                {t("children")} {children}
              </span>
            </span>
          </button>
          {isActive && (
            <div
              ref={guestDropdownRef}
              className="absolute left-0 top-full mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-[100] animate-dropdown"
              onMouseEnter={() => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
                setIsActive(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setIsActive(false), 200);
                setHoverTimeout(timeout);
              }}
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsActive(false)}
                  className="text-primary-600 hover:text-primary-700 text-xs font-semibold transition-colors duration-200"
                  aria-label={t("closeDropdown")}
                >
                  <i className="bi bi-x text-sm"></i>
                </button>
              </div>
              <div className="space-y-2.5">
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
          className="h-9 bg-primary-600 text-white px-3 py-1.5 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all duration-200 w-full sm:w-24"
          onClick={handleSearch}
          aria-label={t("search")}
        >
          <i className="bi bi-search text-xs mr-1"></i>
          {t("search")}
        </button>
      </div>

      {calendar && (
        <div
          ref={calendarRef}
          className={`absolute left-0 top-[8rem] sm:top-[6rem] mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 animate-dropdown w-full ${calendarWidthClass} max-w-full`}
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
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        .animate-dropdown {
          animation: dropdown 0.3s ease-out forwards;
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
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium text-gray-900">{label}</p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(-1)}
          className="flex items-center justify-center w-7 h-7 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all duration-200"
          aria-label={t("decrease", { label })}
          disabled={value <= min}
        >
          <i className="bi bi-dash text-xs"></i>
        </button>
        <p className="text-xs font-medium text-gray-700 w-5 text-center">
          {value}
        </p>
        <button
          onClick={() => onChange(1)}
          className="flex items-center justify-center w-7 h-7 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all duration-200"
          aria-label={t("increase", { label })}
        >
          <i className="bi bi-plus text-xs"></i>
        </button>
      </div>
    </div>
  );
};
