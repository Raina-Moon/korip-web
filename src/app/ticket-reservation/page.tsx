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
          <span className="text-sm">취소 및 환불 정책에 동의합니다.</span>
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
          />
          <span className="text-sm">개인정보 수집·이용에 동의합니다.</span>
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
    </div>
  );
};

export default TicketReservationPage;
