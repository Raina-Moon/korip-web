"use client";

import { fetchLodges, Lodge } from "@/app/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
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

  console.log("🔥 lodge state:", status);

  useEffect(() => {
    if (status === "idle") {
          console.log("✅ dispatching fetchLodges()");

      dispatch(fetchLodges())};
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">관리자 – 숙소 목록</h1>

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
