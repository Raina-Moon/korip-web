"use client";

import { useGetLodgeByIdQuery } from "@/lib/lodge/lodgeApi";
import { usePriceCalcMutation } from "@/lib/price/priceApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const countryOptions = [
  "대한민국",
  "미국",
  "일본",
  "중국",
  "영국",
  "독일",
  "프랑스",
  "호주",
  "캐나다",
];

const ReservationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

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
  const [nationality, setNationality] = useState(countryOptions[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");
  const [agreeCancelPolicy, setAgreeCancelPolicy] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showCancelPolicyModal, setShowCancelPolicyModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [resolvedRoomCount, setResolvedRoomCount] = useState<string | null>(
    null
  );

  const { data: lodge, isLoading } = useGetLodgeByIdQuery(lodgeId ?? "", {
    skip: !lodgeId,
  });

  const selectedRoomType = lodge?.roomTypes.find(
    (room) => room.id === Number(roomTypeId)
  );

  const roomTypeImage = selectedRoomType?.images?.[0]?.imageUrl || "";
  const roomTypeName = selectedRoomType?.name || "Unknown Room Type";

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
    if (isLoading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [isLoading, dispatch]);

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
      <div className="border border-gray-300 rounded-lg p-4 space-y-3">
        <h2 className="text-xl font-bold mb-2">예약 정보</h2>

        <div className="flex gap-4 items-start">
          {roomTypeImage ? (
            <img
              src={roomTypeImage}
              alt={roomTypeName}
              className="w-32 h-24 object-cover rounded"
            />
          ) : (
            <div className="w-32 h-24 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
              No Image
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <p className="font-semibold">{lodgeName}</p>
            <p className="text-gray-700">룸 타입: {roomName}</p>
            <p className="text-gray-700">
              체크인: {checkIn} ~ 체크아웃: {checkOut}
            </p>
            <p className="text-gray-700">
              성인: {adults} / 어린이: {children} / 방 수: {roomCount}
            </p>
          </div>
        </div>
      </div>

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
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="border p-2 rounded"
        >
          {countryOptions.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

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

      <div className="border border-gray-300 rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-bold">약관 동의</h2>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreeCancelPolicy}
            onChange={(e) => setAgreeCancelPolicy(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-800">
            아래{" "}
            <button
              type="button"
              className="text-primary-700 underline"
              onClick={() => setShowCancelPolicyModal(true)}
            >
              취소 및 환불 정책
            </button>
            을 읽고 동의합니다.
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-800">
            아래{" "}
            <button
              type="button"
              className="text-primary-700 underline"
              onClick={() => setShowPrivacyModal(true)}
            >
              개인정보 수집·이용
            </button>
            에 동의합니다.
          </span>
        </label>
      </div>

      <button
        onClick={handleNext}
        disabled={!agreeCancelPolicy || !agreePrivacy}
        className={`px-6 py-2 rounded ${
          agreeCancelPolicy && agreePrivacy
            ? "bg-primary-700 text-white hover:bg-primary-500"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        다음 → 결제 페이지로
      </button>

      {showCancelPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">취소 및 환불 정책</h2>
            <p className="mb-4 text-sm text-gray-700 whitespace-pre-line">
              {`- 체크인 7일 전까지 취소 시: 전액(100%) 환불
- 체크인 24시간 초과~7일 이내 취소 시: 50% 환불
- 체크인 24시간 이내 취소 시: 환불 불가(0%)
        
* 예약 변경 및 취소 시점에 따라 환불 금액이 달라질 수 있습니다.
* 환불 규정에 동의하지 않을 경우 예약 진행이 불가능합니다.`}
            </p>
            <button
              className="mt-4 bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
              onClick={() => setShowCancelPolicyModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">개인정보 수집·이용 동의</h2>
            <p className="mb-4 text-sm text-gray-700 whitespace-pre-line">
              {`- 예약 서비스 제공을 위해 이름, 연락처, 이메일, 국적 등 개인정보를 수집·이용합니다.
- 수집한 정보는 예약 관리 및 고객 응대 목적 외에는 사용되지 않습니다.
- 관련 법령에 따라 안전하게 보관·폐기됩니다.

* 개인정보 수집 및 이용에 동의하지 않을 경우 예약 진행이 불가능합니다.`}
            </p>
            <button
              className="mt-4 bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
              onClick={() => setShowPrivacyModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
