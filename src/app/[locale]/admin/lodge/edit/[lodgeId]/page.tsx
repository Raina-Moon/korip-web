"use client";
export const runtime = 'edge';

import LodgeForm from "@/components/ui/LodgeForm";
import {
  fetchLodgeById,
  updateLodge,
  UpdateLodgePayload,
} from "@/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useLocale } from "@/utils/useLocale";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const LodgeEditPage = () => {
  const { lodgeId } = useParams();
  const id = Number(lodgeId);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const locale = useLocale();

  const lodgeData = useAppSelector((state) => state["admin/lodge"].detail);

  useEffect(() => {
    if (!isNaN(id)) {
      dispatch(fetchLodgeById(id));
    }
  }, [dispatch, id]);

  const handleUpdateLodge = async (data: UpdateLodgePayload) => {
    const updateData = await dispatch(updateLodge(data));

    if (updateLodge.fulfilled.match(updateData)) {
      toast.success("숙소가 성공적으로 수정되었습니다.");
      router.push(`/${locale}/admin/lodge/${id}`);
    } else {
      toast.error("숙소 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex items-center justify-center mx-24 mt-10">
        <div
          className="absolute left-0 p-2 cursor-pointer"
          onClick={() => router.push(`/${locale}/admin/lodge/${id}`)}
        >
          <ArrowLeft />
        </div>
        <h1 className="text-2xl font-bold text-center">숙소 수정</h1>
      </div>
      <LodgeForm
        mode="edit"
        initialData={lodgeData ?? undefined}
        onSubmit={handleUpdateLodge}
      />
    </div>
  );
};

export default LodgeEditPage;
