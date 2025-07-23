"use client";

import LodgeForm from "@/components/ui/LodgeForm";
import { fetchLodgeById, updateLodge } from "@/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LodgeEditPage = () => {
  const { lodgeId } = useParams();
  const id = Number(lodgeId);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const lodgeData = useAppSelector((state) => state["admin/lodge"].detail);

  useEffect(() => {
    if (!isNaN(id)) {
      dispatch(fetchLodgeById(id));
    }
  }, [dispatch, id]);

  const handleUpdateLodge = async (data: any) => {
    const updateData = await dispatch(updateLodge({ id, ...data }));

    if (updateLodge.fulfilled.match(updateData)) {
      alert("숙소가 성공적으로 수정되었습니다.");
      router.push(`/admin/lodge/${id}`);
    } else {
      alert("숙소 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex items-center justify-center mx-24 mt-10">
        <div
          className="absolute left-0 p-2 cursor-pointer"
          onClick={() => router.push(`/admin/lodge/${id}`)}
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
