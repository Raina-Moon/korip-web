"use client";

import React, { useState } from "react";
import { useGetHotspringBySidoQuery } from "../lib/hotspring/hotspringApi";

const HotspringListPage = () => {
  const [selectedSido, setSelectedSido] = useState("서울특별시");
  const { data, error } = useGetHotspringBySidoQuery(selectedSido);
  const options = [
    "서울특별시",
    "부산광역시",
    "대구광역시",
    "인천광역시",
    "광주광역시",
    "대전광역시",
    "울산광역시",
    "세종특별자치시",
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주특별자치도",
  ];
  return (
    <div>
      <select
        value={selectedSido}
        onChange={(e) => setSelectedSido(e.target.value)}
      >
        {options.map((sido) => (
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
