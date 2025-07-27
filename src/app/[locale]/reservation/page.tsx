"use client";

import { useGetLodgeByIdQuery } from "@/lib/lodge/lodgeApi";
import { usePriceCalcMutation } from "@/lib/price/priceApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { hideLoading, showLoading } from "@/lib/store/loadingSlice";
import { useLocale } from "@/utils/useLocale";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ReservationPage = () => {
  const { t } = useTranslation("reservation");
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const locale = useLocale();

  const lodgeId = searchParams.get("lodgeId");
  const roomTypeId = searchParams.get("roomTypeId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const roomCount = searchParams.get("roomCount");
  const lodgeName = searchParams.get("lodgeName") || "Unknown Lodge";
  const roomName = searchParams.get("roomName") || "Unknown Room";

  const countryCodes = ["kr", "us", "jp", "cn", "gb", "de", "fr", "au", "ca"];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState(countryCodes[0]);
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

    router.push(`/${locale}/reservation/confirm?${query}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="border border-gray-300 rounded-lg p-4 space-y-3">
        <h2 className="text-xl font-bold mb-2">{t("reservationInfo")}</h2>

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
            <p className="text-gray-700">
              {t("roomType")}: {roomName}
            </p>
            <p className="text-gray-700">
              {t("checkInOut", { checkIn, checkOut })}
            </p>
            <p className="text-gray-700">
              {t("guests", {
                adults,
                children,
                roomCount: roomCount ?? resolvedRoomCount,
              })}
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold">{t("enterGuestInfo")}</h1>

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
          inputStyle={{
            width: "100%",
            height: "42px",
            borderRadius: "0.375rem",
            border: "1px solid #d1d5db",
            paddingLeft: "48px",
            fontSize: "0.875rem",
          }}
          buttonStyle={{
            borderTopLeftRadius: "0.375rem",
            borderBottomLeftRadius: "0.375rem",
            border: "1px solid #d1d5db",
            backgroundColor: "#f9fafb",
          }}
          containerStyle={{
            width: "100%",
          }}
        />

        <input
          type="email"
          placeholder={t("emailOptional")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded col-span-2"
        />
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">{t("specialRequests")}</h2>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            value="조용한 객실 요청"
            onChange={() => handleCheckBoxChange("조용한 객실 요청")}
            checked={specialRequests.includes("조용한 객실 요청")}
          />
          {t("quietRoom")}
        </label>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            value="유아용 침대 요청"
            onChange={() => handleCheckBoxChange("유아용 침대 요청")}
            checked={specialRequests.includes("유아용 침대 요청")}
          />
          {t("crib")}
        </label>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            value="장애인 접근성 요청"
            onChange={() => handleCheckBoxChange("장애인 접근성 요청")}
            checked={specialRequests.includes("장애인 접근성 요청")}
          />
          {t("accessibility")}
        </label>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            value="고층 객실 요청"
            onChange={() => handleCheckBoxChange("고층 객실 요청")}
            checked={specialRequests.includes("고층 객실 요청")}
          />
          {t("highFloor")}
        </label>

        <textarea
          placeholder={t("customRequestPlaceholder")}
          value={customRequest}
          onChange={(e) => setCustomRequest(e.target.value)}
          className="w-full mt-2 p-2 border rounded"
          rows={4}
        />
      </div>

      {isPriceLoading ? (
        <p>{t("priceLoading")}</p>
      ) : priceError ? (
        <p className="text-red-500">{t("priceError")}</p>
      ) : (
        <p className="text-lg font-semibold text-primary-700">
          {t("totalPrice", { price: priceData?.totalPrice.toLocaleString() })}
        </p>
      )}

      <div className="border border-gray-300 rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-bold">{t("agreement.title")}</h2>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreeCancelPolicy}
            onChange={(e) => setAgreeCancelPolicy(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-800">
            {t("agreement.cancelPolicyPrefix")}
            <button
              type="button"
              className="text-primary-700 underline"
              onClick={() => setShowCancelPolicyModal(true)}
            >
              {t("agreement.cancelPolicyLink")}
            </button>
            {t("agreement.cancelPolicySuffix")}
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
            {t("agreement.privacyPrefix")}
            <button
              type="button"
              className="text-primary-700 underline"
              onClick={() => setShowPrivacyModal(true)}
            >
              {t("agreement.privacyLink")}
            </button>
            {t("agreement.privacySuffix")}
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
        {t("nextButton")}
      </button>

      {showCancelPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">
              {t("modal.cancelPolicyTitle")}
            </h2>
            <pre className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">
              {t("modal.cancelPolicyContent")}
            </pre>
            <button
              className="mt-4 bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
              onClick={() => setShowCancelPolicyModal(false)}
            >
              {t("modal.close")}
            </button>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">
              {t("modal.privacyTitle")}
            </h2>
            <pre className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">
              {t("modal.privacyContent")}
            </pre>
            <button
              className="mt-4 bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-800"
              onClick={() => setShowPrivacyModal(false)}
            >
              {t("modal.close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
