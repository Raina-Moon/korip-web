"use client";

import LodgeForm from "@/app/components/ui/LodgeForm";
import { fetchLodgeById, updateLodge } from "@/app/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LodgeEditPage = () => {
  const { lodgeId } = useParams();
  const id = Number(lodgeId);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const lodgeData = useAppSelector((state) => state["admin/lodge"].detail);

  useEffect(() => {
if(!isNaN(id)) {
      dispatch(fetchLodgeById(id));
    }
  },[dispatch, id]);

  const handleUpdateLodge = async (data: any) => {
    const updateData = await dispatch(updateLodge({ id, ...data }));
    if (updateLodge.fulfilled.match(updateData)) {
      alert("숙소가 성공적으로 수정되었습니다.");
      router.push(`/admin/lodge/${id}`);
    } else {
      alert("숙소 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  console.log("LodgeEditPage lodgeData:", lodgeData);

  return <LodgeForm mode="edit" 
  initialData={lodgeData ?? undefined}
  onSubmit={handleUpdateLodge} />;
};

export default LodgeEditPage;
