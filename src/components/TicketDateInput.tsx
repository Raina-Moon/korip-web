"use client";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { createPortal } from "react-dom";

export default function TicketDateInput({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: (d: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 300 });

  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleOpen = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
      setOpen(true);
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        calendarRef.current &&
        !calendarRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <label className="flex flex-col w-full text-primary-900 font-medium">
        이용 날짜
        <input
          ref={inputRef}
          className="mt-1 border border-primary-800 rounded-md outline-none px-3 py-2 w-full"
          readOnly
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          value={date ? formatDate(date) : ""}
          placeholder="이용 날짜를 선택하세요"
        />
      </label>

      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={calendarRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              zIndex: 9999,
              background: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              padding: "8px",
              width: position.width,
            }}
          >
            <Calendar
              calendarType="gregory"
              onChange={(value) => {
                if (value instanceof Date) {
                  setDate(value);
                  setOpen(false);
                }
              }}
              value={date}
              minDate={new Date()}
            />
          </div>,
          document.body
        )}
    </>
  );
}
