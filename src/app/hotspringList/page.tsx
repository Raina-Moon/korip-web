"use client";

import React, { useState } from "react";
import { useGetHotspringBySidoQuery } from "../lib/hotspring/hotspringApi";

const sidoCenters: Record<string, { lat: number; lng: number }> = {
  서울특별시: { lng: 126.95966555678402, lat: 37.53298542326604 },
};

const HotspringListPage = () => {
  const [selectedSido, setSelectedSido] = useState("서울특별시");
  const coordinates = sidoCenters[selectedSido];
  const { data, error } = useGetHotspringBySidoQuery(coordinates);

  console.log("HotspringListPage data:", data);

  return (
    <div>
      <select
        value={selectedSido}
        onChange={(e) => setSelectedSido(e.target.value)}
      >
        {Object.keys(sidoCenters).map((sido) => (
          <option key={sido} value={sido}>
            {sido}
          </option>
        ))}
      </select>
      <ul>
        {data?.map((spring, idx) => (
          <li key={idx}>
            {spring.properties.uname} ({spring.properties.sido_name}{" "}
            {spring.properties.sigg_name})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotspringListPage;
