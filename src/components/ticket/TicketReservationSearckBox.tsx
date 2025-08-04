"use client";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { useTranslation } from "react-i18next";
import "react-calendar/dist/Calendar.css";

interface TicketSearchBoxProps {
  region?: string;
  setRegion?: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  adults: number;
  setAdults: (value: number) => void;
  children: number;
  setChildren: (value: number) => void;
  handleSearch: () => void;
}

export default function TicketSearchBox({
  region,
  setRegion,
  date,
  setDate,
  adults,
  setAdults,
  children,
  setChildren,
  handleSearch,
}: TicketSearchBoxProps) {
  const { t } = useTranslation("ticket");
  const [calendar, setCalendar] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    date && !isNaN(new Date(date).getTime()) ? new Date(date) : null
  );

  const formatDate = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return "";
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasRegion = region !== undefined && setRegion !== undefined;

 return (
    <div className="w-full max-w-[72rem] mx-auto bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 animate-fade-in">
      <div className="flex flex-row items-end gap-3 flex-nowrap overflow-x-auto" role="group" aria-label={t("searchForm")}>
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
              className="h-9 border border-gray-300 rounded-xl px-2 py-1.5 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200"
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
        <div className="flex flex-col w-full sm:w-48">
          <label
            htmlFor="date"
            className="text-xs font-medium text-gray-900 mb-0.5 uppercase tracking-wide text-left"
          >
            {t("date")}
          </label>
          <input
            id="date"
            className="h-9 border border-gray-300 rounded-xl px-2 py-1.5 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200"
            readOnly
            onClick={() => setCalendar(true)}
            value={formatDate(selectedDate)}
            placeholder={t("date")}
            aria-label={t("date")}
          />
        </div>
        <div className="flex flex-col w-full sm:w-48">
          <label
            htmlFor="adults"
            className="text-xs font-medium text-gray-900 mb-0.5 uppercase tracking-wide text-left"
          >
            {t("adult")}
          </label>
          <QuantitySelector
            label={t("adult")}
            value={adults}
            onChange={(delta) => setAdults(Math.max(1, adults + delta))}
            min={1}
          />
        </div>
        <div className="flex flex-col w-full sm:w-48">
          <label
            htmlFor="children"
            className="text-xs font-medium text-gray-900 mb-0.5 uppercase tracking-wide text-left"
          >
            {t("children")}
          </label>
          <QuantitySelector
            label={t("children")}
            value={children}
            onChange={(delta) => setChildren(Math.max(0, children + delta))}
            min={0}
          />
        </div>
        <button
          className="h-9 bg-primary-500 text-white px-3 py-1.5 rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200 w-full sm:w-24"
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
          className="absolute left-0 top-[7rem] sm:top-[5.5rem] mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-[100] animate-dropdown w-full sm:w-[37.5rem] max-w-[90vw]"
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
              if (value instanceof Date) {
                setSelectedDate(value);
                setDate(formatDate(value));
                setCalendar(false);
              }
            }}
            value={selectedDate}
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
  const { t } = useTranslation("list-lodge");

  return (
    <div className="flex items-center justify-between gap-1.5 h-9 bg-gray-50 border border-gray-300 rounded-xl px-2 py-1.5">
      <p className="text-xs font-medium text-gray-900">{label}</p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(-1)}
          className="flex items-center justify-center w-7 h-7 bg-gray-100 text-primary-500 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200"
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
          className="flex items-center justify-center w-7 h-7 bg-gray-100 text-primary-500 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200"
          aria-label={t("increase", { label })}
        >
          <i className="bi bi-plus text-xs"></i>
        </button>
      </div>
    </div>
  );
};
