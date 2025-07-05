"use client";

import { usePriceCalcMutation } from "@/lib/price/priceApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ReservationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lodgeId = searchParams.get("lodgeId");
  const roomTypeId = searchParams.get("roomTypeId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const roomCount = searchParams.get("roomCount");
  const lodgeName = searchParams.get("lodgeName") || "Unknown Lodge";
  const roomName = searchParams.get("roomName") || "Unknown Room";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");

  const [resolvedRoomCount, setResolvedRoomCount] = useState<string | null>(
    null
  );

  const [params, setParams] = useState<{
    lodgeId: string;
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    adults: string;
    children: string;
    roomCount: string;
    lodgeName: string;
    roomName: string;
  }>({
    lodgeId: "",
    roomTypeId: "",
    checkIn: "",
    checkOut: "",
    adults: "",
    children: "",
    roomCount: "",
    lodgeName: "Unknown Lodge",
    roomName: "Unknown Room",
  });

  useEffect(() => {
    const paramRoomCount = searchParams.get("roomCount");
    if (paramRoomCount) {
      setResolvedRoomCount(paramRoomCount);
    } else {
      const pending = localStorage.getItem("pendingReservation");
      if (pending) {
        try {
          const parsed = JSON.parse(pending);
          if (parsed.roomCount) setResolvedRoomCount(String(parsed.roomCount));
        } catch {}
      }
    }
  }, [searchParams]);

  const [
    triggerPriceCalc,
    { data: priceData, isLoading: isPriceLoading, error: priceError },
  ] = usePriceCalcMutation();

  useEffect(() => {
    const newParams = {
      lodgeId: searchParams.get("lodgeId") ?? "",
      roomTypeId: searchParams.get("roomTypeId") ?? "",
      checkIn: searchParams.get("checkIn") ?? "",
      checkOut: searchParams.get("checkOut") ?? "",
      adults: searchParams.get("adults") ?? "",
      children: searchParams.get("children") ?? "",
      roomCount: searchParams.get("roomCount") ?? "",
      lodgeName: searchParams.get("lodgeName") ?? "Unknown Lodge",
      roomName: searchParams.get("roomName") ?? "Unknown Room",
    };

    setParams((prev) => {
      const isSame = Object.keys(newParams).every(
        (key) =>
          prev[key as keyof typeof prev] ===
          newParams[key as keyof typeof newParams]
      );
      return isSame ? prev : newParams;
    });
  }, [searchParams]);

  useEffect(() => {
    if (
      params.lodgeId &&
      params.roomTypeId &&
      params.checkIn &&
      params.checkOut &&
      params.roomCount
    ) {
      triggerPriceCalc({
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        roomTypeId: Number(params.roomTypeId),
        roomCount: Number(params.roomCount),
      }).unwrap();
    }
  }, [params, triggerPriceCalc]);

  const handleCheckBoxChange = (request: string) => {
    if (specialRequests.includes(request)) {
      setSpecialRequests(specialRequests.filter((req) => req !== request));
    } else {
      setSpecialRequests([...specialRequests, request]);
    }
  };

  const handleNext = () => {
    const updatedPending = {
      lodgeId: String(lodgeId),
      roomTypeId: String(roomTypeId),
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      adults: String(adults),
      children: String(children),
      roomCount: String(roomCount),
      lodgeName,
      roomName,
      firstName,
      lastName,
      nationality,
      phoneNumber,
      email,
      specialRequests: [...specialRequests, customRequest].filter(Boolean),
    };

    localStorage.setItem("pendingReservation", JSON.stringify(updatedPending));

    const query = new URLSearchParams({
      ...updatedPending,
      firstName,
      lastName,
      nationality,
      phoneNumber,
      email,
      totalPrice: String(priceData?.totalPrice || 0),
      specialRequests: JSON.stringify(
        [...specialRequests, customRequest].filter(Boolean)
      ),
    }).toString();

    router.push(`/reservation/confirm?${query}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">예약자 정보 입력</h1>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email (선택)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded col-span-2"
        />
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">특별 요청</h2>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            value="조용한 객실 요청"
            onChange={() => handleCheckBoxChange("조용한 객실 요청")}
            checked={specialRequests.includes("조용한 객실 요청")}
          />
          조용한 객실 요청
        </label>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            value="유아용 침대 요청"
            onChange={() => handleCheckBoxChange("유아용 침대 요청")}
            checked={specialRequests.includes("유아용 침대 요청")}
          />
          유아용 침대 요청
        </label>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            value="장애인 접근성 요청"
            onChange={() => handleCheckBoxChange("장애인 접근성 요청")}
            checked={specialRequests.includes("장애인 접근성 요청")}
          />
          장애인 접근성 요청
        </label>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            value="고층 객실 요청"
            onChange={() => handleCheckBoxChange("고층 객실 요청")}
            checked={specialRequests.includes("고층 객실 요청")}
          />
          고층 객실 요청
        </label>

        <textarea
          placeholder="기타 요청 사항을 입력해주세요"
          value={customRequest}
          onChange={(e) => setCustomRequest(e.target.value)}
          className="w-full mt-2 p-2 border rounded"
          rows={4}
        />
      </div>

      {isPriceLoading ? (
        <p>가격 계산 중...</p>
      ) : priceError ? (
        <p className="text-red-500">가격 정보를 불러오는 데 실패했습니다.</p>
      ) : (
        <p className="text-lg font-semibold text-primary-700">
          총 가격: {priceData?.totalPrice.toLocaleString()}원
        </p>
      )}
      <button
        onClick={handleNext}
        className="bg-primary-700 text-white px-6 py-2 rounded hover:bg-primary-500"
      >
        다음 → 결제 페이지로
      </button>
    </div>
  );
};

export default ReservationPage;
