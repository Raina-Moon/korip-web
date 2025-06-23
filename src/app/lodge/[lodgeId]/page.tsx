"use client";

import { useGetLodgeByIdQuery } from "@/lib/lodge/lodgeApi";
import { useParams } from "next/navigation";
import React from "react";

const LodgeDetailPage = () => {
  const { lodgeId } = useParams() as { lodgeId: string };
const {data:lodge, isLoading,isError} = useGetLodgeByIdQuery(lodgeId)

  if(isLoading) return <div>Loading...</div>;
  if(isError) return <div>Error loading lodge details.</div>;
  if(!lodge) return <div>No lodge data found.</div>;

  return (
    <div>
      <h1>{lodge.name}</h1>
      <p>{lodge.address}</p>
    </div>
  );
};

export default LodgeDetailPage;
