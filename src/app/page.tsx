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
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button>Search</button>
    </div>

    <div>
      <p>News</p>
    </div>

    <div>
      <p>Events</p>
    </div>
    </>
  );
};

export default page;
