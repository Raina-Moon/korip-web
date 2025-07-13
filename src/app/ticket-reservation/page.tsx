"use client";

import { useSearchParams, useRouter } from "next/navigation";
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

const TicketReservationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ticketTypeId = searchParams.get("ticketTypeId") ?? "";
  const date = searchParams.get("date") ?? "";
  const lodgeName = searchParams.get("lodgeName") ?? "Unknown Lodge";
  const ticketTypeName =
    searchParams.get("ticketTypeName") ?? "Unknown Ticket Type";

  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState(countryOptions[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");

  const [agreeCancelPolicy, setAgreeCancelPolicy] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showCancelPolicy, setShowCancelPolicy] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const adultPrice = Number(searchParams.get("adultPrice") || "0");
  const childPrice = Number(searchParams.get("childPrice") || "0");

  const totalPrice = adults * adultPrice + children * childPrice;

  const handleNext = () => {
    const pending = {
      ticketTypeId,
      date,
      adults,
      children,
      firstName,
      lastName,
      nationality,
      phoneNumber,
      email,
      specialRequests: [...specialRequests, customRequest].filter(Boolean),
      lodgeName,
      ticketTypeName,
      totalPrice,
    };

    localStorage.setItem("pendingTicketReservation", JSON.stringify(pending));

    const query = new URLSearchParams({
      ticketTypeId,
      date,
      adults: String(adults),
      children: String(children),
      firstName,
      lastName,
      nationality,
      phoneNumber,
      email,
      specialRequests: JSON.stringify(
        [...specialRequests, customRequest].filter(Boolean)
      ),
      lodgeName,
      ticketTypeName,
    }).toString();

    router.push(`/ticket-reservation/confirm?${query}`);
  };

  const handleCheckBoxChange = (request: string) => {
    if (specialRequests.includes(request)) {
      setSpecialRequests(specialRequests.filter((req) => req !== request));
    } else {
      setSpecialRequests([...specialRequests, request]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">티켓 예약 정보</h1>
      <div className="border border-gray-300 rounded-lg p-4 space-y-2">
        <p className="font-semibold">{lodgeName}</p>
        <p className="text-gray-700">티켓 종류: {ticketTypeName}</p>
        <p className="text-gray-700">이용 날짜: {date}</p>
      </div>

      <h2 className="text-lg font-bold">인원 선택</h2>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          성인
          <input
            type="number"
            value={adults}
            min={0}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>
        <label className="flex flex-col">
          어린이
          <input
            type="number"
            value={children}
            min={0}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>
      </div>

      <h2 className="text-lg font-bold">예약자 정보</h2>
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
          placeholder="전화번호"
          inputStyle={{ width: "100%", height: "42px" }}
          buttonStyle={{ backgroundColor: "#f9fafb" }}
          containerStyle={{ width: "100%" }}
        />
        <input
          type="email"
          placeholder="Email (선택)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded col-span-2"
        />
      </div>

      <h2 className="text-lg font-bold">특별 요청</h2>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            value="휠체어 접근 요청"
            onChange={() => handleCheckBoxChange("휠체어 접근 요청")}
            checked={specialRequests.includes("휠체어 접근 요청")}
          />
          휠체어 접근 요청
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            value="단체 이용 요청"
            onChange={() => handleCheckBoxChange("단체 이용 요청")}
            checked={specialRequests.includes("단체 이용 요청")}
          />
          단체 이용 요청
        </label>
        <textarea
          placeholder="기타 요청 사항을 입력해주세요"
          value={customRequest}
          onChange={(e) => setCustomRequest(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div className="border border-gray-300 rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-bold">약관 동의</h2>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreeCancelPolicy}
            onChange={(e) => setAgreeCancelPolicy(e.target.checked)}
          />
          <span className="text-sm">
            <button
              type="button"
              className="text-primary-700 underline"
              onClick={() => setShowCancelPolicy(true)}
            >
              취소 및 환불 정책
            </button>
            에 동의합니다.
          </span>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
          />
          <span className="text-sm">
            {" "}
            <button
              type="button"
              className="text-primary-700 underline"
              onClick={() => setShowPrivacyPolicy(true)}
            >
              개인정보 수집·이용
            </button>
            에 동의합니다.
          </span>
        </label>
      </div>

      <p className="text-lg font-semibold text-primary-700">
        총 결제 금액: {totalPrice.toLocaleString()}원
      </p>

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

      {showCancelPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">취소 및 환불 정책</h2>
            <pre className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">
              {`본 온천 티켓 예약의 취소 및 환불 규정은 아래와 같습니다.

- 이용일 기준 3일 전(72시간 전)까지 취소 시: 결제금액의 100% 전액 환불
- 이용일 24시간 초과 ~ 3일 이내 취소 시: 결제금액의 50% 환불
- 이용일 24시간 이내 취소 시 또는 노쇼(No-Show): 환불 불가 (0%)

※ 예약 취소는 본 사이트 내 취소 요청 기능을 통해서만 접수되며, 접수 시점 기준으로 위 환불 규정이 적용됩니다.
※ 환불 처리 시 결제 대행사 정책에 따라 결제 수수료 및 환불 처리 수수료가 차감될 수 있습니다.
※ 환불은 결제 수단별로 영업일 기준 약 3~10일 정도 소요될 수 있습니다.
※ 일부 할인 상품, 특가 상품은 별도의 환불 불가 규정이 적용될 수 있으며 예약 시 별도로 안내됩니다.
※ 천재지변, 정부 방침 등 불가항력적 사유로 인해 이용이 불가능한 경우 별도의 환불 정책이 적용될 수 있습니다.

본인은 위 내용을 충분히 읽고 이해하였으며, 본 취소 및 환불 정책에 동의합니다.`}
            </pre>
            <button
              className="mt-4 bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
              onClick={() => setShowCancelPolicy(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">개인정보 수집·이용 동의</h2>
            <pre className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">
              {`본인은 온천 티켓 예약 서비스 이용을 위해 아래와 같은 개인정보 수집 및 이용에 동의합니다.

1. 수집 항목
- 이름(First Name, Last Name)
- 연락처(전화번호, 이메일)
- 국적
- 예약 정보(온천명, 티켓 종류, 인원수, 이용일)
- 요청사항(특별 요청 등)

2. 수집 및 이용 목적
- 예약 처리 및 관리
- 예약 확인 및 변경, 취소, 환불 등 고객 응대
- 결제 처리 및 정산
- 법령상 의무 이행 및 분쟁 해결
- 서비스 품질 개선 및 고객 문의 대응

3. 보유 및 이용 기간
- 예약 이행 및 사후 처리 목적을 위해 예약 완료일로부터 5년간 보관
- 전자상거래 등 소비자보호에 관한 법률 등 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 법령에서 정한 기간까지 보관

4. 제3자 제공 및 처리 위탁
- 결제 대행사, 예약 관리 시스템, 고객센터 위탁업체 등 서비스 제공에 필요한 범위 내에서 개인정보 처리 위탁이 이루어질 수 있습니다.

본인은 위 내용을 충분히 읽고 이해하였으며, 개인정보 수집 및 이용에 동의합니다.`}
            </pre>
            <button
              className="mt-4 bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
              onClick={() => setShowPrivacyPolicy(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketReservationPage;
