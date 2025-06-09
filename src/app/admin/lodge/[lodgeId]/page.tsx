"use client";

import { fetchLodgeById } from "@/app/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const LodgeDetailPage = () => {
  const lodgeId = Number(useParams());

  const dispatch = useAppDispatch();
  const lodge = useAppSelector((state) =>
    state["admin/lodge"].list.find((l) => l.id === lodgeId)
  );
  const status = useAppSelector((state) => state["admin/lodge"].state);
  const error = useAppSelector((state) => state["admin/lodge"].error);

  useEffect(() => {
    if (!lodge) return;
    dispatch(fetchLodgeById(lodgeId));
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
      </div>
    </div>
  );
};

export default LodgeDetailPage;
