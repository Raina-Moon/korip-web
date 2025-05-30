"use client";

import React, { useState } from "react";
import { useGetHotspringBySidoQuery } from "../lib/hotspring/hotspringApi";

const sidoCenters: Record<string, { lat: number; lng: number }> = {
"서울특별시": { lat: 37.5665, lng: 126.9780 },
"부산광역시": { lat: 35.1796, lng: 129.0756 },
"대구광역시": { lat: 35.8714, lng: 128.6014 },
"인천광역시": { lat: 37.4563, lng: 126.7052 },
"광주광역시": { lat: 35.1595, lng: 126.8526 },
"대전광역시": { lat: 36.3504, lng: 127.3845 },
"울산광역시": { lat: 35.5384, lng: 129.3114 },
"세종특별자치시": { lat: 36.4801, lng: 127.2890 },
"경기도": { lat: 37.4138, lng: 127.5183 },
"강원도": { lat: 37.8228, lng: 128.1555 },
"충청북도": { lat: 36.6357, lng: 127.4917 },
"충청남도": { lat: 36.5184, lng: 126.8000 },
"전라북도": { lat: 35.7167, lng: 127.1442 },
"전라남도": { lat: 34.8161, lng: 126.4630 },
"경상북도": { lat: 36.4919, lng: 128.8889 },
"경상남도": { lat: 35.4606, lng: 128.2132 },
"제주특별자치도": { lat: 33.4996, lng: 126.5312 },
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
