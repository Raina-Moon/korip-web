"use client";

import React, { useEffect } from "react";
import {
  deleteLodge,
  fetchLodgeById,
  fetchLodges,
} from "@/app/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { useParams, useRouter } from "next/navigation";
import KakaoMap from "@/app/components/KakaoMap";

const LodgeDetailPage = () => {
  const params = useParams();
  const lodgeId = Number(params.lodgeId);

  const lodge = useAppSelector((state) => state["admin/lodge"].detail);
  const status = useAppSelector((state) => state["admin/lodge"].state);
  const error = useAppSelector((state) => state["admin/lodge"].error);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isNaN(lodgeId)) {
      dispatch(fetchLodgeById(lodgeId));
    }
  }, [dispatch, lodgeId]);

  if (status === "loading")
    return <p className="p-8 text-lg">Loading lodge details...</p>;
  if (status === "failed")
    return <p className="p-8 text-red-600">Error: {error}</p>;
  if (!lodge) return <p className="p-8">No lodge found with ID {lodgeId}</p>;

  const handleDeleteLodge = async (lodgeId: number) => {
    const confirmed = confirm("정말로 이 숙소를 삭제하시겠습니까?");
    if (!confirmed) return;

    const resultAction = await dispatch(deleteLodge(lodgeId));
    if (deleteLodge.fulfilled.match(resultAction)) {
      dispatch(fetchLodges());
      alert("숙소가 성공적으로 삭제되었습니다.");
      router.push("/admin/lodge");
    } else {
      alert("숙소 삭제에 실패했습니다.");
      console.error("Failed to delete lodge:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lodge Detail Page</h1>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => router.push(`/admin/lodge/edit/${lodge.id}`)}
          >
            수정
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => handleDeleteLodge(lodgeId)}
          >
            삭제
          </button>
        </div>
      </div>
      <section className="space-y-1">
        <div className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-700">
              {lodge.name}
            </h2>
            <p>
              <span className="font-medium text-gray-600">Address:</span>{" "}
              {lodge.address}
            </p>
            <p>
              <span className="font-medium text-gray-600">Description:</span>{" "}
              {lodge.description}
            </p>
            <p>
              <span className="font-medium text-gray-600">
                Accommodation Type:
              </span>{" "}
              {lodge.accommodationType}
            </p>
          </div>
          <div className="flex-1">
            <KakaoMap
              viewOnly
              initialPosition={{
                lat: Number(lodge.latitude),
                lng: Number(lodge.longitude),
                address: lodge.address,
              }}
              onLocationChange={() => {}}
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-gray-700 mt-10 mb-4">
          Room Types
        </h3>
        <div className="grid gap-6">
          {lodge.roomTypes?.map((roomType, idx) => (
            <div
              key={idx}
              className="p-5 border rounded-lg shadow-sm bg-white space-y-2"
            >
              <p className="text-lg font-semibold">{roomType.name}</p>
              <p>{roomType.description}</p>
              <div className="grid grid-cols-2 gap-x-6">
                <p>
                  <span className="font-medium">Base Price:</span>{" "}
                  {roomType.basePrice}원
                </p>
                <p>
                  <span className="font-medium">Weekend Price:</span>{" "}
                  {roomType.weekendPrice ?? "N/A"}원
                </p>
                <p>
                  <span className="font-medium">Max Adults:</span>{" "}
                  {roomType.maxAdults}
                </p>
                <p>
                  <span className="font-medium">Max Children:</span>{" "}
                  {roomType.maxChildren}
                </p>
                <p>
                  <span className="font-medium">Total Rooms:</span>{" "}
                  {roomType.totalRooms}
                </p>
              </div>

              {roomType.seasonalPricing &&
                roomType.seasonalPricing.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2">
                      Seasonal Pricing
                    </h4>
                    <table className="w-full text-sm text-left border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-2 py-1">From</th>
                          <th className="border px-2 py-1">To</th>
                          <th className="border px-2 py-1">Price</th>
                          <th className="border px-2 py-1">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomType.seasonalPricing.map((season, idx) => (
                          <tr key={idx}>
                            <td className="border px-2 py-1">{season.from}</td>
                            <td className="border px-2 py-1">{season.to}</td>
                            <td className="border px-2 py-1">
                              {season.basePrice}원
                            </td>
                            <td className="border px-2 py-1">
                              {season.weekendPrice}원
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LodgeDetailPage;
