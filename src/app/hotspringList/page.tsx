"use client";

import React, { useState } from "react";
import { useGetHotspringBySidoQuery } from "../lib/hotspring/hotspringApi";


const HotspringListPage = () => {
  const [selectedSido, setSelectedSido] = useState("서울특별시");
  const { data, error } = useGetHotspringBySidoQuery();

  console.log("HotspringListPage data:", data);

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
      <ul>
        {data?.map((spring, idx) => (
          <li key={idx}>
            {spring.properties.uname} ({spring.properties.sido_name}{" "}
            {spring.properties.sigg_name})
            {spring.properties.remark}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotspringListPage;
