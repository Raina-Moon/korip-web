"use client";

import React, { useState } from "react";
import { createLodge } from "@/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import LodgeForm from "@/components/ui/LodgeForm";
import { ArrowLeft } from "lucide-react";
import { RoomType, TicketType } from "@/types/lodge";
import { useLocale } from "@/utils/useLocale";
import toast from "react-hot-toast";

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
  ticketTypes: TicketType[];
}

const CreateLodgePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();
  const lodgeState = useAppSelector((state) => state["admin/lodge"].state);

  const handleCreateLodge = async (data: CreateLodgeFormData) => {
    setIsSubmitting(true);
    const { newImageFiles, roomTypeImages, ticketTypes, ...dataWithoutImages } =
      data;
    const lodgeData = await dispatch(
      createLodge({
        ...dataWithoutImages,
        description: dataWithoutImages.description ?? null,
        roomTypes: dataWithoutImages.roomTypes.map((room) => {
          const { seasonalPricing, images, ...roomWithoutExtras } = room;
          return {
            ...roomWithoutExtras,
            seasonalPricing: seasonalPricing ?? [],
          };
        }),
        lodgeImageFile: newImageFiles,
        roomTypeImages,
        ticketTypes: ticketTypes ?? [],
      })
    );

    setIsSubmitting(false);
    if (createLodge.fulfilled.match(lodgeData)) {
      toast.success("숙소가 성공적으로 등록되었습니다.");
      router.push(`/${locale}/admin/lodge`);
    } else {
      toast.error("숙소 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col">
      {isSubmitting && (
        <div className="absolute z-50 inset-0 bg-black bg-opacity-60 flex items-center justify-center pointer-events-none">
          <div className="text-white text-3xl font-bold animate-pulse pointer-events-auto">
            숙소 등록 중...
          </div>
        </div>
      )}

      <div className="relative flex items-center justify-center mx-24 mt-10">
        <div
          className="absolute left-0 p-2 cursor-pointer"
          onClick={() => router.push(`/${locale}/admin/lodge`)}
        >
          <ArrowLeft />
        </div>
        <h1 className="text-2xl font-bold text-center">숙소 등록</h1>
      </div>
      <LodgeForm mode="create" onSubmit={handleCreateLodge} />
    </div>
  );
};

export default CreateLodgePage;
