"use client";

import React from "react";
import { createLodge } from "@/lib/admin/lodge/lodgeThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import LodgeForm from "@/components/ui/LodgeForm";
import { ArrowLeft } from "lucide-react";
import { RoomType, SeasonalPricing } from "@/types/lodge";

interface CreateLodgeFormData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  accommodationType: string;
  roomTypes: RoomType[];
  newImageFiles: File[];
  roomTypeImages: File[][];
}

const CreateLodgePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCreateLodge = async (data: CreateLodgeFormData) => {
    console.log("Creating lodge with data:", data);
    const {newImageFiles, roomTypeImages, ...dataWithoutImages} = data;
    const lodgeData = await dispatch(
      createLodge({
        ...dataWithoutImages,
        description: dataWithoutImages.description ?? null,
        roomTypes: dataWithoutImages.roomTypes.map((room): Omit<RoomType, "seasonalPricing"> & { seasonalPricing?: SeasonalPricing[] } => {
          const { seasonalPricing, ...roomWithoutSeasonal } = room;
          return {
            ...roomWithoutSeasonal,
            seasonalPricing: seasonalPricing ?? [],
          };
        }),
        lodgeImageFile: newImageFiles,
        roomTypeImages,
      })
    );


    if (createLodge.fulfilled.match(lodgeData)) {
      alert("숙소가 성공적으로 등록되었습니다.");
      router.push("/admin/lodge");
    } else {
      alert("숙소 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex items-center justify-center mx-24 mt-10">
        <div className="absolute left-0 p-2 cursor-pointer" onClick={() => router.push("/admin/lodge")}>
          <ArrowLeft />
        </div>
        <h1 className="text-2xl font-bold text-center">숙소 등록</h1>
      </div>
      <LodgeForm
        mode="create"
        onSubmit={handleCreateLodge}
      />
      </div>
  );
};

export default CreateLodgePage;
