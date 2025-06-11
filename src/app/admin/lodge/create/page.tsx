"use client";

import React, { useState } from "react";
import { createLodge, RoomType } from "@/app/lib/admin/lodge/lodgeThunk";
import { useAppDispatch } from "@/app/lib/store/hooks";
import { useRouter } from "next/navigation";
import LodgeForm from "@/app/components/ui/LodgeForm";

const CreateLodgePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCreateLodge = async (data: any) => {
    const lodgeData = await dispatch(
      createLodge({
        ...data,
        roomTypes: data.roomTypes.map((room: RoomType) => ({
          ...room,
          seasonalPricing: room.seasonalPricing ?? [],
        })),
      })
    );

    console.log("Lodge creation response:", lodgeData);

    if (createLodge.fulfilled.match(lodgeData)) {
      alert("숙소가 성공적으로 등록되었습니다.");
      router.push("/admin/lodge");
    } else {
      alert("숙소 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <LodgeForm
      mode="create"
      onSubmit={handleCreateLodge}
    />
  );
};

export default CreateLodgePage;
