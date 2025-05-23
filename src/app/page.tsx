"use client";

import React, { useState } from "react";
import HeaderBar from "./components/HeaderBar";

const page = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      <div>
        <HeaderBar />
      </div>
      <div className="flex justify-center items-center gap-4 mt-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-primary-800 rounded px-2 py-1 w-[60%] outline-none"
        />
        <button className="bg-primary-700 text-white px-2 py-1 rounded-md">
          Search
        </button>
      </div>

      <div className="flex justify-between items-center mt-5 px-5 w-[60%] gap-10">
        <div className="border-b border-primary-800 w-full">
          <p className="text-primary-800 font-bold text-3xl">News</p>
        </div>

        <div className="border-b border-primary-800 w-full">
          <p className="text-primary-800 font-bold text-3xl">Events</p>
        </div>
      </div>
    </>
  );
};

export default page;
