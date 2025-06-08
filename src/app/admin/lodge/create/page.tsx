"use client";

import React, { useState } from "react";
import { createLodge, RoomType } from "@/app/lib/admin/lodge/lodgeThunk";
import { useAppDispatch } from "@/app/lib/store/hooks";
import { useRouter } from "next/navigation";
import KakaoMap from "@/app/components/KakaoMap";

const CreateLodgePage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [description, setDescription] = useState("");
  const [accommodationType, setAccommodationType] = useState("호텔");
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [roomTypeName, setRoomTypeName] = useState("");
  const [roomTypeDescription, setRoomTypeDescription] = useState("");
  const [roomTypeBasePrice, setRoomTypeBasePrice] = useState(0);
  const [roomTypeMaxAdults, setRoomTypeMaxAdults] = useState(1);
  const [roomTypeMaxChildren, setRoomTypeMaxChildren] = useState(0);
  const [roomTypeTotalRooms, setRoomTypeTotalRooms] = useState(1);

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
        roomTypes,
      })
    );

    console.log("Lodge creation response:", lodgeData);

    if (createLodge.fulfilled.match(lodgeData)) {
      alert("숙소가 성공적으로 등록되었습니다.");
      router.push("/admin/lodge");
    } else {
      alert("숙소 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleAddRoomType = () => {
    setRoomTypes((prev) => [
      ...prev,
      {
        name: roomTypeName,
        description: roomTypeDescription,
        basePrice: roomTypeBasePrice,
        maxAdults: roomTypeMaxAdults,
        maxChildren: roomTypeMaxChildren,
        totalRooms: roomTypeTotalRooms,
      },
    ]);
  };

  const handleRoomTypeChange = (
    idx: number,
    key: string,
    value: string | number
  ) => {
    const updatedRoomTypes = [...roomTypes];
    updatedRoomTypes[idx] = {
      ...updatedRoomTypes[idx],
      [key]: value,
    };
    setRoomTypes(updatedRoomTypes);
  };

  const handleRemoveRoomType = (idx: number) => {
    setRoomTypes((prev) => prev.filter((_, index) => index !== idx));
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

        <div className="space-y-4">
          <h3 className="text-lg font-bold mt-6">Room Types</h3>
          {roomTypes.map((room, idx) => (
            <div key={idx} className="border p-4 rounded space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold">방 유형 {idx + 1}</p>
                {roomTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRoomType(idx)}
                    className="text-red-600 text-sm"
                  >
                    삭제
                  </button>
                )}
              </div>
              <input
                value={room.name}
                onChange={(e) =>
                  handleRoomTypeChange(idx, "name", e.target.value)
                }
                placeholder="방 이름 (예: 스탠다드)"
                className="input"
              />
              <input
                value={room.description ?? ""}
                onChange={(e) =>
                  handleRoomTypeChange(idx, "description", e.target.value)
                }
                placeholder="방 설명"
                className="input"
              />
              <input
                type="number"
                value={room.basePrice}
                onChange={(e) =>
                  handleRoomTypeChange(idx, "basePrice", Number(e.target.value))
                }
                placeholder="가격"
                className="input"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={room.maxAdults}
                  onChange={(e) =>
                    handleRoomTypeChange(
                      idx,
                      "maxAdults",
                      Number(e.target.value)
                    )
                  }
                  placeholder="성인 최대"
                  className="input flex-1"
                />
                <input
                  type="number"
                  value={room.maxChildren}
                  onChange={(e) =>
                    handleRoomTypeChange(
                      idx,
                      "maxChildren",
                      Number(e.target.value)
                    )
                  }
                  placeholder="어린이 최대"
                  className="input flex-1"
                />
              </div>
              <input
                type="number"
                value={room.totalRooms}
                onChange={(e) =>
                  handleRoomTypeChange(
                    idx,
                    "totalRooms",
                    Number(e.target.value)
                  )
                }
                placeholder="총 객실 수"
                className="input"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddRoomType}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            + 방 유형 추가
          </button>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          숙소 등록하기
        </button>
      </form>
    </div>
  );
};

export default CreateLodgePage;
