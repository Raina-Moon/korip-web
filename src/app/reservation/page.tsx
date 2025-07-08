"use client";

import { useGetLodgeByIdQuery } from "@/lib/lodge/lodgeApi";
import { usePriceCalcMutation } from "@/lib/price/priceApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

        <PhoneInput
          country={"kr"}
          value={phoneNumber}
          onChange={(phone) => setPhoneNumber(phone)}
          inputClass="!w-full !border !rounded !p-2"
          containerClass="!w-full"
          placeholder="전화번호를 입력하세요"
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
        disabled={
          !agreeCancelPolicy ||
          !agreePrivacy ||
          !firstName.trim() ||
          !lastName.trim() ||
          !phoneNumber.trim()
        }
        className={`px-6 py-2 rounded ${
          agreeCancelPolicy &&
          agreePrivacy &&
          firstName.trim() &&
          lastName.trim() &&
          phoneNumber.trim()
            ? "bg-primary-700 text-white hover:bg-primary-500"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        다음 → 결제 페이지로
      </button>

      {showCancelPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">취소 및 환불 정책</h2>
            <pre className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">
              {`본 숙박 예약의 취소 및 환불 규정은 아래와 같습니다.

- 체크인 기준 7일 전(168시간 전)까지 취소 시: 결제금액의 100% 전액 환불
- 체크인 24시간 초과 ~ 7일 이내 취소 시: 결제금액의 50% 환불
- 체크인 24시간 이내 취소 시 또는 노쇼(No-Show): 환불 불가 (0%)

※ 예약 취소는 본 사이트 내 취소 요청 기능을 통해서만 접수되며, 접수 시점 기준으로 위 환불 규정이 적용됩니다.
※ 환불 처리 시 결제 대행사 정책에 따라 결제 수수료 및 환불 처리 수수료가 차감될 수 있습니다.
※ 환불은 결제 수단별로 영업일 기준 약 3~10일 정도 소요될 수 있습니다.
※ 일부 프로모션, 할인 상품, 특가 상품, 제한적 환불 불가 조건이 명시된 상품은 별도의 환불 불가 규정이 우선 적용되며, 예약 화면 및 결제 단계에서 별도로 안내됩니다.
※ 숙소의 불가피한 사정(자연재해, 정부 방침, 긴급 상황 등)으로 예약이 취소되는 경우에는 별도의 환불 정책이 적용될 수 있습니다.
※ 자세한 내용은 고객센터 또는 사이트 내 '취소 및 환불 정책' 페이지를 통해 확인할 수 있습니다.

본인은 위 내용을 충분히 읽고 이해하였으며, 본 취소 및 환불 정책에 동의합니다.`}
            </pre>
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">개인정보 수집·이용 동의</h2>
            <pre className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">
              {`본인은 예약 서비스 이용을 위해 아래와 같은 개인정보 수집 및 이용에 동의합니다.

1. 수집 항목
- 이름(First Name, Last Name)
- 연락처(전화번호, 이메일)
- 국적
- 예약 정보(숙소명, 객실 타입, 인원수, 숙박일정)
- 요청사항(특별 요청 등)

2. 수집 및 이용 목적
- 예약 처리 및 관리
- 예약 확인 및 변경, 취소, 환불 등 고객 응대
- 결제 처리 및 정산
- 법령상 의무 이행 및 분쟁 해결
- 서비스 품질 개선 및 고객 문의 대응
- 마케팅 및 이벤트 정보 제공 (선택 동의 시 별도로 안내)

3. 보유 및 이용 기간
- 예약 이행 및 사후 처리 목적을 위해 예약 완료일로부터 5년간 보관
- 전자상거래 등 소비자보호에 관한 법률 등 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 법령에서 정한 기간까지 보관

4. 제3자 제공 및 처리 위탁
- 결제 대행사, 예약 관리 시스템, 고객센터 위탁업체 등 서비스 제공에 필요한 범위 내에서 개인정보 처리 위탁이 이루어질 수 있습니다.
- 위탁 및 제공 받는 자, 목적, 보유 기간 등은 개인정보처리방침에 명시되어 있습니다.

5. 개인정보처리방침
- 개인정보의 수집·이용, 제공, 보관 및 파기에 대한 자세한 내용은 본 사이트 하단의 [개인정보처리방침] 링크를 통해 상시 확인하실 수 있습니다.

6. 동의 거부 권리 및 불이익
- 이용자는 개인정보 수집 및 이용에 동의하지 않을 권리가 있으며, 동의 거부 시 서비스 이용(예약)이 제한될 수 있습니다.

본인은 위 내용을 충분히 읽고 이해하였으며, 개인정보 수집 및 이용에 동의합니다.`}
            </pre>
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
