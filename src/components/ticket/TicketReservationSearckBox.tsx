"use client";

import React from "react";

interface TicketSearchBoxProps {
  date: string;
  setDate: (value: string) => void;
  adults: number;
  setAdults: (value: number) => void;
  children: number;
  setChildren: (value: number) => void;
  handleSearch: () => void;
}

export default function TicketSearchBox({
  date,
  setDate,
  adults,
  setAdults,
  children,
  setChildren,
  handleSearch,
}: TicketSearchBoxProps) {
    
  return (
    <div className="w-full bg-white rounded-lg shadow-lg flex flex-wrap items-center justify-center gap-4 px-5 py-5 mb-8">
      <input
        type="date"
        className="border border-primary-800 rounded-md px-3 py-1"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <QuantitySelector label="Adult" value={adults} setValue={setAdults} />
      <QuantitySelector label="Children" value={children} setValue={setChildren} />

      <button
        className="bg-primary-700 text-white px-4 py-1 rounded-md hover:bg-primary-500"
        onClick={handleSearch}
      >
        검색
      </button>
    </div>
  );
}

const QuantitySelector = ({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-primary-900 font-semibold">{label}:</span>
    <button
      onClick={() => setValue(Math.max(0, value - 1))}
      className="border border-primary-800 px-2 rounded"
    >
      -
    </button>
    <span className="px-2">{value}</span>
    <button
      onClick={() => setValue(value + 1)}
      className="border border-primary-800 px-2 rounded"
    >
      +
    </button>
  </div>
);
