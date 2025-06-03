"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [searchList, setSearchList] = useState([]);

  const searchParams = useSearchParams();

  const region = searchParams.get("region") || "All";
  const checkin = searchParams.get("checkIn") || "Not specified";
  const checkout = searchParams.get("checkOut") || "Not specified";
  const room = searchParams.get("room") || "1";
  const adult = searchParams.get("adult") || "1";
  const children = searchParams.get("children") || "0";

  return (
    <div>
      <p>{searchList.length}</p>
      <p>Region: {region}</p>
      <p>Check-in : {checkin}</p>
      <p>Check-out : {checkout}</p>
      <p>Room: {room}</p>
      <p>Adult: {adult}</p>
      <p>Children: {children}</p>
    </div>
  );
};

export default Page;
