"use client";

import React, { useState } from "react";


const HotspringListPage = () => {
  const [selectedSido, setSelectedSido] = useState("서울특별시");


  return (
    <div>
      {/* <select
        value={selectedSido}
        onChange={(e) => setSelectedSido(e.target.value)}
      >
        {Object.keys().map((sido) => (
          <option key={sido} value={sido}>
            {sido}
          </option>
        ))}
      </select> */}
      
    </div>
  );
};

export default HotspringListPage;
