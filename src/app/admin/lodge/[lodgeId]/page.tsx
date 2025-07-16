"use client";

import React, { useEffect, useState } from "react";
import {
  deleteLodge,
  fetchLodgeById,
  fetchLodgeInventories,
  fetchLodges,
} from "@/lib/admin/lodge/lodgeThunk";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useParams, useRouter } from "next/navigation";
import KakaoMap from "@/components/KakaoMap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import InventoryCalendar from "@/components/ui/InventoryCalendar";

const LodgeDetailPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string[]>([]);
  const [currentModalImage, setCurrentModalImage] = useState(0);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const params = useParams();
  const lodgeId = Number(params.lodgeId);

  const lodge = useAppSelector((state) => state["admin/lodge"].detail);
  const status = useAppSelector((state) => state["admin/lodge"].state);
  const error = useAppSelector((state) => state["admin/lodge"].error);
  const roomInventories = useAppSelector(
    (state) => state["admin/lodge"].roomInventories
  );
  const ticketInventories = useAppSelector(
    (state) => state["admin/lodge"].ticketInventories
  );

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isNaN(lodgeId)) {
      dispatch(fetchLodgeById(lodgeId));
    }
  }, [dispatch, lodgeId]);

  useEffect(() => {
    if (status === "loading") {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, []);

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

  const handlePrevImage = () => {
    if (!lodge.images) return;
    setCurrentImage((prev) =>
      prev === 0 ? lodge.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!lodge.images) return;
    setCurrentImage((prev) =>
      prev === lodge.images.length - 1 ? 0 : prev + 1
    );
  };

  const openImageModal = (images: string[], selected: number) => {
    setModalImage(images);
    setCurrentModalImage(selected);
    setIsOpen(true);
  };

  const closeImageModal = () => {
    setIsOpen(false);
    setModalImage([]);
    setCurrentModalImage(0);
  };

  const handlePrevModal = () => {
    setCurrentModalImage((prev) =>
      prev === 0 ? modalImage.length - 1 : prev - 1
    );
  };

  const handleNextModal = () => {
    setCurrentModalImage((prev) =>
      prev === modalImage.length - 1 ? 0 : prev + 1
    );
  };

  const handleOpenInventoryModal = async () => {
    await dispatch(fetchLodgeInventories(lodgeId));
    setIsInventoryModalOpen(true);
  };

  const handleCloseInventoryModal = () => {
    setIsInventoryModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className=" relative flex-row items-center justify-between mb-6">
        <div
          className="cursor-pointer absolute left-0"
          onClick={() => router.push("/admin/lodge")}
        >
          <ArrowLeft />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          숙소 상세 정보
        </h1>
        <div className="gap-4 flex justify-end">
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
        <div className="flex flex-row items-center justify-start">
          <div className="flex-1 items-start">
            <h2 className="text-xl font-semibold text-gray-700">
              숙소명 : {lodge.name}
            </h2>
            <p>
              <span className="font-medium text-gray-600">주소:</span>{" "}
              {lodge.address}
            </p>
            <p>
              <span className="font-medium text-gray-600">설명:</span>{" "}
              {lodge.description}
            </p>
            <p>
              <span className="font-medium text-gray-600">숙소 유형:</span>{" "}
              {lodge.accommodationType}
            </p>
          </div>
          <div className="flex-1">
            {lodge.images && lodge.images.length > 0 ? (
              <div className="relative">
                <Image
                  src={lodge.images[currentImage].imageUrl}
                  alt={lodge.name}
                  className="w-full h-auto rounded-lg shadow-md cursor-pointer"
                  width={500}
                  height={300}
                  onClick={() =>
                    openImageModal(
                      lodge.images.map((img) => img.imageUrl),
                      currentImage
                    )
                  }
                />

                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                >
                  <ArrowLeft />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                >
                  <ArrowRight />
                </button>
              </div>
            ) : (
              <p className="text-gray-500">이미지가 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-gray-700">방 유형</h3>
          <button
            className="text-blue-500 underline"
            onClick={handleOpenInventoryModal}
          >
            재고 보기
          </button>
        </div>{" "}
        <div className="grid gap-6">
          {lodge.roomTypes?.map((roomType, idx) => (
            <div
              key={idx}
              className="p-5 border rounded-lg shadow-sm bg-white space-y-2"
            >
              <p className="text-lg font-semibold">이름 : {roomType.name}</p>
              <p>설명 : {roomType.description}</p>
              <div className="grid grid-cols-2 gap-x-6">
                <p>
                  <span className="font-medium">기본 요금:</span>{" "}
                  {typeof roomType.basePrice === "number"
                    ? `${roomType.basePrice.toLocaleString()}원`
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">주말 요금:</span>{" "}
                  {typeof roomType.weekendPrice === "number"
                    ? `${roomType.weekendPrice.toLocaleString()}원`
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">최대 성인:</span>{" "}
                  {roomType.maxAdults}
                </p>
                <p>
                  <span className="font-medium">최대 어린이:</span>{" "}
                  {roomType.maxChildren}
                </p>
                <p>
                  <span className="font-medium">총 객실 수:</span>{" "}
                  {roomType.totalRooms}
                </p>
              </div>

              {roomType.images && roomType.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {roomType.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image.imageUrl}
                      alt={`${roomType.name} 이미지 ${index + 1}`}
                      className="rounded-md shadow-md object-cover w-full h-32 cursor-pointer"
                      width={300}
                      height={200}
                      onClick={() =>
                        openImageModal(
                          roomType.images?.map((img) => img.imageUrl) ?? [],
                          index
                        )
                      }
                    />
                  ))}
                </div>
              )}

              {roomType.seasonalPricing &&
                roomType.seasonalPricing.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2">성수기</h4>
                    <table className="w-full text-sm text-left border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-2 py-1">시작</th>
                          <th className="border px-2 py-1">종료</th>
                          <th className="border px-2 py-1">기본 요금</th>
                          <th className="border px-2 py-1">주말 요금</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomType.seasonalPricing.map((season, idx) => (
                          <tr key={idx}>
                            <td className="border px-2 py-1">
                              {new Date(season.from).toLocaleDateString(
                                "ko-KR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td className="border px-2 py-1">
                              {new Date(season.to).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </td>
                            <td className="border px-2 py-1">
                              {typeof season.basePrice === "number"
                                ? `${season.basePrice.toLocaleString()}원`
                                : "N/A"}
                            </td>
                            <td className="border px-2 py-1">
                              {typeof season.weekendPrice === "number"
                                ? `${season.weekendPrice.toLocaleString()}원`
                                : "N/A"}
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
        <section className="mt-10">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">티켓 타입</h3>
          {lodge.ticketTypes && lodge.ticketTypes.length > 0 ? (
            <div className="grid gap-6">
              {lodge.ticketTypes.map((ticket, idx) => (
                <div
                  key={idx}
                  className="p-5 border rounded-lg shadow-sm bg-white space-y-2"
                >
                  <p className="text-lg font-semibold">이름: {ticket.name}</p>
                  <p>설명: {ticket.description}</p>
                  <p>
                    <span className="font-medium">성인 가격:</span>{" "}
                    {ticket.adultPrice.toLocaleString()}원
                  </p>
                  <p>
                    <span className="font-medium">어린이 가격:</span>{" "}
                    {ticket.childPrice.toLocaleString()}원
                  </p>
                  <p>
                    <span className="font-medium">총 성인 티켓 수:</span>{" "}
                    {ticket.totalAdultTickets}
                  </p>
                  <p>
                    <span className="font-medium">총 어린이 티켓 수:</span>{" "}
                    {ticket.totalChildTickets}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">등록된 티켓이 없습니다.</p>
          )}
        </section>
        <div className="flex-1 mt-20">
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
      </section>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
            <button
              onClick={handlePrevModal}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 z-10 hover:bg-gray-600"
            >
              <ArrowLeft />
            </button>

            <Image
              src={modalImage[currentModalImage]}
              alt="modal preview"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
              priority
            />
            <button
              onClick={handleNextModal}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 z-10 hover:bg-gray-600"
            >
              <ArrowRight />
            </button>

            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white text-3xl font-bold z-20"
            >
              ×
            </button>
          </div>

          <div className="flex gap-2 mt-6 overflow-x-auto max-w-full px-4">
            {modalImage.map((url, idx) => (
              <div
                key={idx}
                className={`w-24 h-16 relative cursor-pointer ${
                  idx === currentModalImage ? "ring-4 ring-blue-400" : ""
                }`}
                onClick={() => setCurrentModalImage(idx)}
              >
                <Image
                  src={url}
                  alt={`thumbnail-${idx}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {isInventoryModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={handleCloseInventoryModal}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-3xl w-full h-[80vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseInventoryModal}
              className="absolute top-2 right-2 text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4">날짜별 재고 현황</h2>

            <InventoryCalendar
              roomInventories={roomInventories}
              ticketInventories={ticketInventories}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LodgeDetailPage;
