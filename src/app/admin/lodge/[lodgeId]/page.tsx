"use client";

import { fetchLodgeById } from "@/app/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const LodgeDetailPage = () => {
  const params = useParams();
  const lodgeId = Number(params.lodgeId);

  const dispatch = useAppDispatch();
  const lodge = useAppSelector((state) =>
    state["admin/lodge"].list.find((l) => l.id === lodgeId)
  );
  const status = useAppSelector((state) => state["admin/lodge"].state);
  const error = useAppSelector((state) => state["admin/lodge"].error);

  useEffect(() => {
    if (!isNaN(lodgeId) && !lodge && status !== "loading") {
      dispatch(fetchLodgeById(lodgeId));
    }
  }, [dispatch, lodgeId, lodge]);

  if (status === "loading") {
    return <p>Loading lodge details...</p>;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  if (!lodge) {
    return <p>No lodge found with ID {lodgeId}</p>;
  }

  return (
    <div>
      <h1>Lodge Detail Page</h1>
      <div>
        <h2>{lodge.name}</h2>
        <p>{lodge.address}</p>
        <p>{lodge.description}</p>
        <p>Latitude: {lodge.latitude}</p>
        <p>Longitude: {lodge.longitude}</p>
        <p>Accommodation Type: {lodge.accommodationType}</p>
        <p>RoomType :</p>
        <ul>
          {lodge.roomTypes.map((roomType, idx) => (
            <li key={idx}>
              <p>{roomType.name}</p>
              <p>{roomType.description}</p>
              <p>{roomType.basePrice}</p>
              <p>{roomType.weekendPrice}</p>
              <p>{roomType.maxAdults}</p>
              <p>{roomType.maxChildren}</p>
              <p>{roomType.totalRooms}</p>
              <ul>
                {roomType.seasonalPricing?.map((season, idx) => (
                  <li key={idx}>
                    <p>From : {season.from}</p>
                    <p>To : {season.to}</p>
                    <p>Price : {season.price}</p>
                    <p>Type : {season.type}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LodgeDetailPage;
