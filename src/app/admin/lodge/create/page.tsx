"use client";

import React, { useState } from "react";
import { createLodge } from "@/app/lib/admin/lodge/lodgeThunk";
import { useAppDispatch } from "@/app/lib/store/hooks";
import { useRouter } from "next/navigation";
import { create } from "domain";
import KakaoMap from "@/app/components/KakaoMap";

const CreateLodgePage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [description, setDescription] = useState("");
  const [accommodationType, setAccommodationType] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCreateLodge = async () => {
    const lodgeData = await dispatch(
      createLodge({
        name,
        address,
        latitude,
        longitude,
        description,
        accommodationType,
      })
    );

    if (createLodge.fulfilled.match(lodgeData)) {
      alert("숙소가 성공적으로 등록되었습니다.");
      router.push("/admin/lodge");
    } else {
      alert("숙소 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <KakaoMap
        onLocationChange={(lat, lng, addr) => {
          setLatitude(lat);
          setLongitude(lng);
          setAddress(addr);
        }}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateLodge();
        }}
        className="space-y-4"
      >
        <p>숙소명</p>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <p>숙소 주소</p>
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
        <p>숙소 좌표</p>
        <input
          value={latitude}
          onChange={(e) => setLatitude(Number(e.target.value))}
        />
        <input
          value={longitude}
          onChange={(e) => setLongitude(Number(e.target.value))}
        />
        <p>숙소 설명</p>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p>숙소 유형</p>
        <select
          value={accommodationType}
          onChange={(e) => setAccommodationType(e.target.value)}
        >
          <option value="hotel">호텔</option>
          <option value="motel">모텔</option>
          <option value="resort">리조트</option>
          <option value="pension">펜션</option>
          <option value="other">기타</option>
        </select>
      </form>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        숙소 등록하기
      </button>
    </div>
  );
};

export default CreateLodgePage;
