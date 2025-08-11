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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    date && !isNaN(new Date(date).getTime()) ? new Date(date) : null
  );

  // lock body scroll when calendar is open on mobile
  useEffect(() => {
    if (calendarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [calendarOpen]);

  const formatDate = (d: Date | null) => {
    if (!d || isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // close calendar when clicking outside (desktop dropdown)
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (calendarRef.current && !calendarRef.current.contains(target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const hasRegion = region !== undefined && setRegion !== undefined;

  return (
    <div className="w-full max-w-[72rem] mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-200 animate-fade-in">
      <div
        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        role="group"
        aria-label={t("searchForm")}
      >
        {hasRegion && (
          <div className="flex flex-col">
            <label
              htmlFor="region"
              className="text-xs font-medium text-gray-900 mb-1 uppercase tracking-wide text-left"
            >
              {t("selectRegion")}
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion!(e.target.value)}
              className="h-11 border border-gray-300 rounded-xl px-3 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
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

        <div className="flex flex-col">
          <label
            htmlFor="date"
            className="text-xs font-medium text-gray-900 mb-1 uppercase tracking-wide text-left"
          >
            {t("date")}
          </label>
          <button
            id="date"
            type="button"
            className="h-11 border border-gray-300 rounded-xl px-3 text-sm text-gray-700 w-full bg-gray-50 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            onClick={() => setCalendarOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={calendarOpen}
            aria-label={t("date")}
          >
            {formatDate(selectedDate) || t("date")}
          </button>
        </div>

        <div className="flex flex-col xs:col-span-2 sm:col-span-1">
          <label
            htmlFor="adults"
            className="text-xs font-medium text-gray-900 mb-1 uppercase tracking-wide text-left whitespace-nowrap"
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

        <div className="flex flex-col xs:col-span-2 sm:col-span-1">
          <label
            htmlFor="children"
            className="text-xs font-medium text-gray-900 mb-1 uppercase tracking-wide text-left whitespace-nowrap"
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

        <div className="flex items-end col-span-1 xs:col-span-2 sm:col-span-1 lg:col-span-1">
          <button
            className="h-11 w-full bg-primary-500 text-white px-4 rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            onClick={handleSearch}
            aria-label={t("search")}
          >
            <i className="bi bi-search text-xs mr-1" />
            {t("search")}
          </button>
        </div>
      </div>

      {calendarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-[99] sm:bg-transparent sm:static sm:hidden"
            aria-hidden="true"
            onClick={() => setCalendarOpen(false)}
          />
          <div
            ref={calendarRef}
            role="dialog"
            aria-modal="true"
            className={`
              z-[100]
              sm:absolute sm:left-0 sm:top-[5.25rem] sm:mt-2
              sm:w-[37.5rem] sm:max-w-[90vw]
              sm:bg-white sm:border sm:border-gray-200 sm:rounded-xl sm:shadow-lg sm:p-4 sm:animate-dropdown
              fixed inset-x-0 bottom-0 sm:static
              mx-auto sm:mx-0
              w-full sm:w-auto
              bg-white p-4 rounded-t-2xl sm:rounded-xl
            `}
            onMouseEnter={() => {
              if (hoverTimeout) {
                window.clearTimeout(hoverTimeout);
                setHoverTimeout(null);
              }
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 640) {
                const timeout = window.setTimeout(
                  () => setCalendarOpen(false),
                  200
                );
                setHoverTimeout(timeout);
              }
            }}
          >
            <div className="flex justify-end sm:hidden mb-2">
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setCalendarOpen(false)}
                aria-label={t("close")}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <Calendar
              calendarType="gregory"
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                  setDate(formatDate(value));
                  setCalendarOpen(false);
                }
              }}
              value={selectedDate}
              minDate={new Date()}
              prev2Label={null}
              next2Label={null}
            />
          </div>
        </>
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
          animation: dropdown 0.25s ease-out forwards;
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
    <div className="flex items-center justify-between gap-2 h-11 bg-gray-50 border border-gray-300 rounded-xl px-2">
      <p className="text-xs font-medium text-gray-900">{label}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(-1)}
          className="flex items-center justify-center w-9 h-9 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition disabled:opacity-40"
          aria-label={t("decrease", { label })}
          disabled={value <= min}
        >
          <i className="bi bi-dash" />
        </button>
        <p className="text-sm font-medium text-gray-800 w-6 text-center">
          {value}
        </p>
        <button
          type="button"
          onClick={() => onChange(1)}
          className="flex items-center justify-center w-9 h-9 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          aria-label={t("increase", { label })}
        >
          <i className="bi bi-plus" />
        </button>
      </div>
    </div>
  );
};
