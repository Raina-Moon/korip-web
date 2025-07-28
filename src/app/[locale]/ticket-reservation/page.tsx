
"use client";
export const runtime = 'edge';

import { useLocale } from "@/utils/useLocale";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const TicketReservationPage = () => {
  const countryCodes = ["kr", "us", "jp", "cn", "gb", "de", "fr", "au", "ca"];

  const { t } = useTranslation("ticket-reservation");
  const searchParams = useSearchParams();
  const router = useRouter();

  const locale = useLocale();

  const ticketTypeId = searchParams.get("ticketTypeId") ?? "";
  const date = searchParams.get("date") ?? "";
  const lodgeName = searchParams.get("lodgeName") ?? "Unknown Lodge";
  const ticketTypeName =
    searchParams.get("ticketTypeName") ?? "Unknown Ticket Type";

  const [adults, setAdults] = useState<number>(
    Number(searchParams.get("adults") || "1")
  );
  const [children, setChildren] = useState<number>(
    Number(searchParams.get("children") || "0")
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState(countryCodes[0]);
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
      totalPrice: String(totalPrice),
    }).toString();

    router.push(`/${locale}/ticket-reservation/confirm?${query}`);
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
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      <div className="border border-gray-300 rounded-lg p-4 space-y-2">
        <p className="font-semibold">{lodgeName}</p>
        <p className="text-gray-700">
          {t("ticketType")}: {ticketTypeName}
        </p>
        <p className="text-gray-700">
          {t("date")}: {date}
        </p>
      </div>

      <h2 className="text-lg font-bold">{t("selectGuests")}</h2>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          {t("adults")}
          <input
            type="number"
            value={adults}
            min={0}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>
        <label className="flex flex-col">
          {t("children")}
          <input
            type="number"
            value={children}
            min={0}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </label>
      </div>

      <h2 className="text-lg font-bold">{t("guestInfo")}</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={t("firstName")}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder={t("lastName")}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="border p-2 rounded"
        >
          {countryCodes.map((code) => (
            <option key={code} value={code}>
              {t(`countries.${code}`)}
            </option>
          ))}
        </select>
        <PhoneInput
          country={"kr"}
          value={phoneNumber}
          onChange={(phone) => setPhoneNumber(phone)}
          placeholder={t("phone")}
          inputStyle={{ width: "100%", height: "42px" }}
          buttonStyle={{ backgroundColor: "#f9fafb" }}
          containerStyle={{ width: "100%" }}
        />
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded col-span-2"
        />
      </div>

      <h2 className="text-lg font-bold">{t("specialRequest")}</h2>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            value="휠체어 접근 요청"
            onChange={() => handleCheckBoxChange("휠체어 접근 요청")}
            checked={specialRequests.includes("휠체어 접근 요청")}
          />
          {t("wheelchair")}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            value="단체 이용 요청"
            onChange={() => handleCheckBoxChange("단체 이용 요청")}
            checked={specialRequests.includes("단체 이용 요청")}
          />
          {t("group")}
        </label>
        <textarea
          placeholder={t("customRequest")}
          value={customRequest}
          onChange={(e) => setCustomRequest(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div className="border border-gray-300 rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-bold">{t("agreementTitle")}</h2>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreeCancelPolicy}
            onChange={(e) => setAgreeCancelPolicy(e.target.checked)}
          />
          <span className="text-sm">
            {t("agreeCancelPrefix")}
            <button
              type="button"
              className="text-primary-700 underline"
              onClick={() => setShowCancelPolicy(true)}
            >
              {t("agreeCancelLink")}
            </button>
            {t("agreeCancelSuffix")}
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
            {t("agreePrivacyPrefix")}
            <button
              type="button"
              className="text-primary-700 underline"
              onClick={() => setShowPrivacyPolicy(true)}
            >
              {t("agreePrivacyLink")}
            </button>
            {t("agreePrivacySuffix")}
          </span>
        </label>
      </div>

      <p className="text-lg font-semibold text-primary-700">
        {t("totalPrice")}: {totalPrice.toLocaleString()} KRW
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
        {t("nextStep")}
      </button>

      {showCancelPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">{t("cancelPolicyTitle")}</h2>
            <pre className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">
              {t("cancelPolicyText")}
            </pre>
            <button
              className="mt-4 bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
              onClick={() => setShowCancelPolicy(false)}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}

      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">
              {t("privacyPolicyTitle")}
            </h2>
            <pre className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">
              {t("privacyPolicyText")}
            </pre>
            <button
              className="mt-4 bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
              onClick={() => setShowPrivacyPolicy(false)}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketReservationPage;