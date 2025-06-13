"use client";

import { fetchLodges } from "@/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Lodge } from "@/types/lodge";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const LodgePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState("전체");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const lodges = useAppSelector(
    (state) => state["admin/lodge"].list as Lodge[]
  );
  const status = useAppSelector((state) => state["admin/lodge"].state);
  const error = useAppSelector((state) => state["admin/lodge"].error);

  const regionOptions = useMemo(() => {
    const regions = new Set(
      lodges.map((lodge) => lodge.address?.split(" ")[0]?.slice(0, 2))
    );
    return ["전체", ...Array.from(regions)];
  }, [lodges]);

  const filteredLodges = useMemo(() => {
    return selectedRegion === "전체"
      ? lodges
      : lodges.filter((lodge) => lodge.address?.startsWith(selectedRegion));
  }, [lodges, selectedRegion]);

  const pageNation = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredLodges.slice(start, start + 10);
  }, [filteredLodges, currentPage]);

  const totalPages = Math.ceil(filteredLodges.length / 10);

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

      <div className="mb-6 flex items-center">
        <label className="text-lg font-semibold">지역 필터 : </label>
        <select
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 ml-2 focus:outline-none"
        >
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {pageNation.length === 0 ? (
        <p className="text-gray-500">등록된 숙소가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {pageNation.map((lodge) => (
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

      {totalPages > 1 && (
        <div>
          {Array.from({length : totalPages}, (_, index) => (
            <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LodgePage;
