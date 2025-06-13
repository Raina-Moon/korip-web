"use client";

import { fetchLodges, Lodge } from "@/app/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LodgePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const lodges = useAppSelector(
    (state) => state["admin/lodge"].list as Lodge[]
  );
  const status = useAppSelector((state) => state["admin/lodge"].state);
  const error = useAppSelector((state) => state["admin/lodge"].error);

  useEffect(() => {
    if (status === "idle" || status === "failed") {
      dispatch(fetchLodges());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <p className="text-gray-600">Loading lodges...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col py-8 px-24 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="cursor-pointer" onClick={() => router.back()}>
          <ArrowLeft />
        </div>
        <h1 className="text-3xl font-bold">관리자 – 숙소 목록</h1>
        <button
          onClick={() => router.push("/admin/lodge/create")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          숙소 추가하기
        </button>
      </div>

      {lodges.length === 0 ? (
        <p className="text-gray-500">등록된 숙소가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {lodges.map((lodge) => (
            <li
              key={lodge.id}
              className="flex justify-between items-center border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-1">
                <p className="text-xl font-medium">{lodge.name}</p>
                <p className="text-sm text-gray-600">{lodge.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/lodge/${lodge.id}`)}
                  className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                  상세보기
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LodgePage;
