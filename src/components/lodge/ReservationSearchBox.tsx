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
  const [isMdUp, setIsMdUp] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const guestDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMdUp("matches" in e ? e.matches : (e as MediaQueryList).matches);
    onChange(mql);
    mql.addEventListener?.(
      "change",
      onChange as (e: MediaQueryListEvent) => void
    );
    return () =>
      mql.removeEventListener?.(
        "change",
        onChange as (e: MediaQueryListEvent) => void
      );
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setCalendar, setIsActive]);

  const hasRegion = region !== undefined && setRegion !== undefined;
  const hasAccommodationType =
    accommodationType !== undefined && setAccommodationType !== undefined;

  useEffect(() => {
    if (!isMdUp && calendar) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [calendar, isMdUp]);

  return (
    <div className="w-full max-w-[72rem] mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-200 animate-fade-in">
      <div
        role="group"
        aria-label={t("searchForm")}
        className={`
          grid gap-3
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-6
          items-end
        `}
      >
        {hasRegion && (
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="region">{t("selectRegion")}</Label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion?.(e.target.value)}
              className="h-11 sm:h-9 border border-gray-300 rounded-xl px-3 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all"
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
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="accommodationType">{t("accommodationType")}</Label>
            <select
              id="accommodationType"
              value={accommodationType}
              onChange={(e) => setAccommodationType?.(e.target.value)}
              className="h-11 sm:h-9 border border-gray-300 rounded-xl px-3 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all"
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

        <div className="col-span-1">
          <Label htmlFor="checkIn">{t("checkInPlaceholder")}</Label>
          <input
            id="checkIn"
            className="h-11 sm:h-9 border border-gray-300 rounded-xl px-3 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all cursor-pointer"
            readOnly
            onClick={() => setCalendar(true)}
            value={formatDate(dateRange?.[0] ?? null)}
            placeholder={t("checkInPlaceholder")}
            aria-label={t("checkInPlaceholder")}
          />
        </div>

        <div className="col-span-1">
          <Label htmlFor="checkOut">{t("checkOutPlaceholder")}</Label>
          <input
            id="checkOut"
            className="h-11 sm:h-9 border border-gray-300 rounded-xl px-3 text-sm text-gray-700 w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all cursor-pointer"
            readOnly
            onClick={() => setCalendar(true)}
            value={formatDate(dateRange?.[1] ?? null)}
            placeholder={t("checkOutPlaceholder")}
            aria-label={t("checkOutPlaceholder")}
          />
        </div>

        <div className="col-span-2 sm:col-span-1 md:col-span-2 relative">
          <Label htmlFor="guests">{t("guests")}</Label>
          <button
            id="guests"
            onClick={() => setIsActive(!isActive)}
            className={`
  h-11 sm:h-9 border border-gray-300 rounded-xl px-3 md:px-4
  text-sm text-gray-700 w-full bg-gray-50 hover:bg-gray-100
  focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1
  transition-all flex items-center justify-between gap-2
`}
            aria-label={t("guests")}
          >
            <span className="flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2">
              <Pill>
                {t("room")} {room}
              </Pill>
              <Pill>
                {t("adult")} {adults}
              </Pill>
              {children > 0 && (
                <Pill>
                  {t("children")} {children}
                </Pill>
              )}
            </span>
            <i className="bi bi-people text-sm opacity-70" />
          </button>

          {isActive && (
            <div
              ref={guestDropdownRef}
              className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-[100] animate-dropdown"
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
                  className="text-primary-600 hover:text-primary-700 text-xs font-semibold transition-colors"
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

        <div className="col-span-2 sm:col-span-1 md:col-start-6 md:col-span-1">
          <button
            className="h-11 sm:h-9 bg-primary-600 text-white w-full px-3 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all flex items-center justify-center gap-1.5"
            onClick={handleSearch}
            aria-label={t("search")}
          >
            <i className="bi bi-search text-xs"></i>
            {t("search")}
          </button>
        </div>
      </div>

      {calendar && (
        <>
          {!isMdUp && (
            <div
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setCalendar(false)}
            />
          )}

          <div
            ref={calendarRef}
            className={
              isMdUp
                ? "absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 animate-dropdown w-full max-w-[48rem]"
                : "fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl p-4 z-50 animate-slide-up"
            }
            onMouseEnter={() => {
              if (hoverTimeout) clearTimeout(hoverTimeout);
              setCalendar(true);
            }}
            onMouseLeave={() => {
              if (!isMdUp) return;
              const timeout = setTimeout(() => setCalendar(false), 200);
              setHoverTimeout(timeout);
            }}
            style={isMdUp ? { top: "7.5rem" } : undefined}
          >
            {!isMdUp && (
              <div className="flex items-center justify-between mb-2">
                <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" />
                <button
                  onClick={() => setCalendar(false)}
                  className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100"
                  aria-label={t("closeDropdown")}
                >
                  <i className="bi bi-x-lg text-base" />
                </button>
              </div>
            )}

            <Calendar
              calendarType="gregory"
              onChange={(value) => {
                if (Array.isArray(value) && value.length === 2) {
                  const vr = value as [Date, Date];
                  setDateRange(vr);
                  setCheckIn(formatDate(vr[0]));
                  setCheckOut(formatDate(vr[1]));
                  setCalendar(false);
                }
              }}
              selectRange
              showDoubleView={isMdUp}
              value={dateRange}
              minDate={new Date()}
              prev2Label={isMdUp ? "«" : null}
              next2Label={isMdUp ? "»" : null}
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
        @keyframes slide-up {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0%);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        .animate-dropdown {
          animation: dropdown 0.25s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] sm:text-xs font-medium text-gray-900 mb-1 uppercase tracking-wide text-left block"
    >
      {children}
    </label>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium">
      {children}
    </span>
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
      <p className="text-xs sm:text-[13px] font-medium text-gray-900">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(-1)}
          className="flex items-center justify-center w-9 h-9 sm:w-7 sm:h-7 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all disabled:opacity-40"
          aria-label={t("decrease", { label })}
          disabled={value <= min}
        >
          <i className="bi bi-dash text-base sm:text-xs"></i>
        </button>
        <p className="text-sm sm:text-xs font-medium text-gray-700 w-7 text-center">
          {value}
        </p>
        <button
          onClick={() => onChange(1)}
          className="flex items-center justify-center w-9 h-9 sm:w-7 sm:h-7 bg-gray-100 text-primary-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:ring-offset-1 transition-all"
          aria-label={t("increase", { label })}
        >
          <i className="bi bi-plus text-base sm:text-xs"></i>
        </button>
      </div>
    </div>
  );
};
