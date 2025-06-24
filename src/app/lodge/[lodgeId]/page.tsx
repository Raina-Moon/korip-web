"use client";

import { useGetLodgeByIdQuery } from "@/lib/lodge/lodgeApi";
import { createReservation } from "@/lib/reservation/reservationThunk";
import { useAppDispatch } from "@/lib/store/hooks";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const LodgeDetailPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(0);
  const [modalImages, setModalImages] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn") || "Not specified";
  const checkOut = searchParams.get("checkOut") || "Not specified";
  const adults = Number(searchParams.get("adults")) || 1;
  const children = Number(searchParams.get("children")) || 0;
  const roomCount = Number(searchParams.get("roomCount")) || 1;

  const { lodgeId } = useParams() as { lodgeId: string };

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: lodge, isLoading, isError } = useGetLodgeByIdQuery(lodgeId);
  const imageUrl = lodge?.images?.map((image) => image.imageUrl) ?? [];

  const openModal = (images: string[], index: number) => {
    setModalImages(images);
    setCurrentModalImage(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalImages([]);
    setCurrentModalImage(0);
  };

  const handlePrevImage = () => {
    setCurrentModalImage((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentModalImage((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleReserve = async(roomTypeId: number) => {
    if(!checkIn || !checkOut) {
      alert("체크인과 체크아웃 날짜를 선택해주세요.");
      return;
    }
    try {
        await dispatch(
            createReservation({
                lodgeId: Number(lodgeId),
                roomTypeId,
                checkIn,
                checkOut,
                adults,
                children,
                roomCount,
            })
        )
        alert("예약이 완료되었습니다.");
        router.push("/reservations/success");
    } catch (error) {
        console.error("예약 실패:", error);
        alert("예약에 실패했습니다. 다시 시도해주세요.");
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading lodge details.</div>;
  if (!lodge) return <div>No lodge data found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="w-full h-80 rounded-xl overflow-hidden mb-6 cursor-pointer">
        {imageUrl[0] ? (
          <Image
            src={imageUrl[0]}
            alt={lodge.name}
            width={1200}
            height={400}
            className="object-cover w-full h-full"
            onClick={() => openModal(imageUrl, 0)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No image available
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold text-primary-900 mb-2">{lodge.name}</h1>
      <p className="text-gray-600 mb-4">{lodge.address}</p>

      {/* 설명 */}
      {lodge.description && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">숙소 설명</h2>
          <p className="text-gray-700">{lodge.description}</p>
        </div>
      )}

      {/* 객실 목록 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">객실 정보</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {lodge.roomTypes?.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold mb-2">{room.name}</h3>
              <p className="text-gray-600 mb-1">
                성인 최대 인원: {room.maxAdults}
              </p>
              <p className="text-gray-600 mb-1">
                어린이 최대 인원: {room.maxChildren}
              </p>
              <p className="text-gray-600 mb-2">
                기본 가격: ₩{room.basePrice.toLocaleString()}
              </p>
              <button
                onClick={() => room.id !== undefined && handleReserve(room.id)}
                className="mt-4 bg-primary-800 text-white px-4 py-2 rounded hover:bg-primary-500"
              >
                이 객실 예약하기
              </button>
              {room.images?.[0]?.imageUrl && (
                <Image
                  src={room.images[0].imageUrl}
                  alt={room.name}
                  width={400}
                  height={200}
                  className="rounded object-cover w-full h-48 mt-2 hover:cursor-pointer"
                  onClick={() =>
                    openModal(room.images?.map((img) => img.imageUrl) ?? [], 0)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 모달 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 z-10 hover:bg-gray-600"
            >
              <ArrowLeft />
            </button>

            <Image
              src={modalImages[currentModalImage]}
              alt="modal preview"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
              priority
            />

            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 z-10 hover:bg-gray-600"
            >
              <ArrowRight />
            </button>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-3xl font-bold z-20"
            >
              ×
            </button>
          </div>

          {/* 썸네일 */}
          <div className="flex gap-2 mt-6 overflow-x-auto max-w-full px-4">
            {modalImages.map((url, idx) => (
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
    </div>
  );
};

export default LodgeDetailPage;
