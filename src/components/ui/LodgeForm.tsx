import React, { useEffect, useState } from "react";
import KakaoMap from "../KakaoMap";
import PriceInput from "./PriceInput";
import {
  Lodge,
  LodgeImage,
  RoomType,
  RoomTypeImage,
  TicketType,
} from "@/types/lodge";
import Image from "next/image";

type LodgeFormProps = {
  mode: "create" | "edit";
  initialData?: Lodge;
  onSubmit: (data: any) => void;
};

const LodgeForm = ({ mode, initialData, onSubmit }: LodgeFormProps) => {
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
  const [roomTypeWeekendPrice, setRoomTypeWeekendPrice] = useState(0);
  const [roomTypeMaxAdults, setRoomTypeMaxAdults] = useState(1);
  const [roomTypeMaxChildren, setRoomTypeMaxChildren] = useState(0);
  const [roomTypeTotalRooms, setRoomTypeTotalRooms] = useState(1);
  const [lodgeImages, setLodgeImages] = useState<LodgeImage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [roomTypeImages, setRoomTypeImages] = useState<
    Array<File | RoomTypeImage>[]
  >([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketName, setTicketName] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketAdultPrice, setTicketAdultPrice] = useState(0);
  const [ticketChildPrice, setTicketChildPrice] = useState(0);
  const [ticketTotalAdultTickets, setTicketTotalAdultTickets] = useState(1);
  const [ticketTotalChildTickets, setTicketTotalChildTickets] = useState(1);

  const handleAddRoomType = () => {
    setRoomTypes((prev) => [
      ...prev,
      {
        name: roomTypeName,
        description: roomTypeDescription,
        basePrice: roomTypeBasePrice,
        weekendPrice: roomTypeWeekendPrice,
        maxAdults: roomTypeMaxAdults,
        maxChildren: roomTypeMaxChildren,
        totalRooms: roomTypeTotalRooms,
        seasonalPricing: [],
        roomTypeImage: [],
      },
    ]);
    setRoomTypeImages((prev) => [...prev, []]);
  };

  const handleRoomTypeChange = (idx: number, key: string, value: any) => {
    const updatedRoomTypes = [...roomTypes];
    updatedRoomTypes[idx] = {
      ...updatedRoomTypes[idx],
      [key]: value,
    };
    setRoomTypes(updatedRoomTypes);
  };

  const handleRemoveRoomType = (idx: number) => {
    setRoomTypes((prev) => prev.filter((_, index) => index !== idx));
    setRoomTypeImages((prev) => prev.filter((_, index) => index !== idx));
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setAddress(initialData.address);
      setLatitude(initialData.latitude);
      setLongitude(initialData.longitude);
      setDescription(initialData.description ?? "");
      setAccommodationType(initialData.accommodationType);
      setRoomTypes(initialData.roomTypes ?? []);
      setLodgeImages(initialData.images ?? []);
      setRoomTypeImages(
        (initialData.roomTypes ?? []).map((roomType) =>
          roomType.images ? [...roomType.images] : []
        ) ?? []
      );
      setTicketTypes(initialData.ticketTypes ?? []);
    }
  }, [mode, initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedImages((prev) => [...prev, ...files]);
    }
  };

  const handleImageRemove = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddTicketType = () => {
    setTicketTypes((prev) => [
      ...prev,
      {
        name: ticketName,
        description: ticketDescription,
        adultPrice: ticketAdultPrice,
        childPrice: ticketChildPrice,
        totalAdultTickets: ticketTotalAdultTickets,
        totalChildTickets: ticketTotalChildTickets,
      },
    ]);

    setTicketName("");
    setTicketDescription("");
    setTicketAdultPrice(0);
    setTicketChildPrice(0);
    setTicketTotalAdultTickets(1);
    setTicketTotalChildTickets(1);
  };

  const handleTicketTypeChange = (idx: number, key: string, value: any) => {
    const updated = [...ticketTypes];
    updated[idx] = {
      ...updated[idx],
      [key]: value,
    };
    setTicketTypes(updated);
  };

  const handleRemoveTicketType = (idx: number) => {
    setTicketTypes((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleRemoveLodgeImage = (index: number) => {
    setLodgeImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const formateDate = (date: string | Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const newRoomTypeImageFiles = roomTypeImages.map((images) =>
    images.filter((image) => image instanceof File)
  );

  const keepRoomTypeImageIds = roomTypeImages.map((images) =>
    images
      .filter((image): image is RoomTypeImage => !(image instanceof File))
      .map((img) => img.id)
  );

  return (
    <div className="my-20 flex flex-row items-start justify-center">
      <div className="flex flex-col w-full max-w-xl p-6">
        <KakaoMap
          onLocationChange={(lat, lng, addr) => {
            setLatitude(lat);
            setLongitude(lng);
            setAddress(addr);
          }}
          initialPosition={
            mode === "edit" && initialData
              ? {
                  lat: initialData.latitude ?? 0,
                  lng: initialData.longitude ?? 0,
                  address: initialData.address ?? "",
                }
              : undefined
          }
        />
        <div className="flex flex-col mt-7 gap-5">
          <div className="text-start gap-1">
            <p className="text-lg font-semibold">숙소 사진 업로드</p>
            <p className="text-sm text-gray-500">
              숙소 전경 및 공용시설 사진을 업로드 해주세요.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {mode === "edit" &&
              lodgeImages.map((image, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-32 bg-gray-300 rounded-md overflow-hidden"
                >
                  <Image
                    src={image.imageUrl}
                    alt={`Lodge Image ${idx + 1}`}
                    className="object-cover rounded"
                    width={128}
                    height={128}
                  />
                  <button
                    type="button"
                    className="absolute z-10 right-0 top-5 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                    onClick={() => handleRemoveLodgeImage(idx)}
                  >
                    X
                  </button>
                </div>
              ))}

            {uploadedImages.map((file, idx) => (
              <div
                key={idx}
                className="relative w-full h-32 bg-gray-300 rounded-md overflow-hidden"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Lodge Image ${idx + 1}`}
                  className="object-cover rounded"
                  width={128}
                  height={128}
                />
                <button
                  type="button"
                  className="absolute z-10 right-0 top-5 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleImageRemove(idx);
                  }}
                >
                  X
                </button>
              </div>
            ))}
            {lodgeImages.length + uploadedImages.length < 10 && (
              <div className="relative w-full h-32 bg-gray-300 rounded-md overflow-hidden">
                <p>이미지 업로드</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          console.log("🚀 LodgeForm onSubmit ticketTypes:", ticketTypes);
          console.log("🚀 LodgeForm current ticketName field:", ticketName);

          onSubmit({
            id: initialData?.id,
            name,
            address,
            latitude,
            longitude,
            description,
            accommodationType,
            roomTypes: roomTypes.map((room) => ({
              ...room,
              seasonalPricing: room.seasonalPricing ?? [],
            })),
            newImageFiles: uploadedImages,
            keepImgIds: lodgeImages.map((img) => img.id),
            roomTypeImages: newRoomTypeImageFiles,
            keepRoomTypeImgIds: roomTypes
              .flatMap((room, idx) =>
                (keepRoomTypeImageIds[idx] || []).map((imageId) => ({
                  roomTypeId: room.id,
                  imageId,
                }))
              )
              .filter((i) => i.roomTypeId !== undefined),
            ticketTypes: [
              ...ticketTypes,
              ...(ticketName.trim()
                ? [
                    {
                      name: ticketName,
                      description: ticketDescription,
                      adultPrice: ticketAdultPrice,
                      childPrice: ticketChildPrice,
                      totalAdultTickets: ticketTotalAdultTickets,
                      totalChildTickets: ticketTotalChildTickets,
                    },
                  ]
                : []),
            ],
          });
        }}
        className="flex flex-col gap-4 p-6 max-w-2xl w-full"
      >
        <p className="font-bold text-lg">숙소명</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-600 px-3 py-1 outline-none rounded-md focus:border-blue-500"
        />
        <p className="font-bold text-lg">숙소 주소</p>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border border-gray-600 px-3 py-1 outline-none rounded-md focus:border-blue-500"
        />
        <p className="font-bold text-lg">숙소 설명</p>
        <textarea
          placeholder="숙소에 대한 자세한 설명을 입력하세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-400 px-4 py-3 rounded-md resize-y min-h-[120px] focus:border-blue-500 focus:outline-none"
        />

        <p className="font-bold text-lg">숙소 유형</p>
        <select
          value={accommodationType}
          onChange={(e) => setAccommodationType(e.target.value)}
          className="border border-gray-600 px-3 py-1 outline-none rounded-md focus:border-blue-500"
        >
          <option value="hotel">호텔</option>
          <option value="motel">모텔</option>
          <option value="resort">리조트</option>
          <option value="pension">펜션</option>
          <option value="other">기타</option>
        </select>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold mt-6">방 유형</h3>
          {roomTypes.map((room, idx) => (
            <div
              key={idx}
              className="border p-4 rounded border-gray-400 space-y-2 shadow-md"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-xl">방 유형 {idx + 1}</p>
                {roomTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRoomType(idx)}
                    className="bg-red-600 text-white text-md px-3 py-1 rounded hover:bg-red-700"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="font-semibold text-lg">방 이름</p>
              <input
                value={room.name}
                onChange={(e) =>
                  handleRoomTypeChange(idx, "name", e.target.value)
                }
                placeholder="방 이름 (예: 스탠다드)"
                className="input border border-gray-600 px-3 py-1 outline-none rounded-md focus:border-blue-500"
              />
              <p className="font-semibold text-lg">방 설명</p>
              <textarea
                value={room.description ?? ""}
                onChange={(e) =>
                  handleRoomTypeChange(idx, "description", e.target.value)
                }
                placeholder="방 설명"
                className="w-full border border-gray-400 px-4 py-3 rounded-md resize-y min-h-[120px] focus:border-blue-500 focus:outline-none"
              />
              <p className="font-semibold text-lg">기본 가격</p>
              <PriceInput
                value={room.basePrice}
                onChange={(value) =>
                  handleRoomTypeChange(idx, "basePrice", value)
                }
                placeholder="평일 가격"
              />
              <p className="font-semibold text-lg">주말 가격</p>
              <PriceInput
                value={room.weekendPrice ?? 0}
                onChange={(value) =>
                  handleRoomTypeChange(idx, "weekendPrice", value)
                }
                placeholder="주말 가격"
              />

              <div className="flex gap-2">
                <p className="font-semibold text-lg">최대 성인 수</p>
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
                  className="border border-gray-600 px-3 py-1 outline-none rounded-md flex-1 focus:border-blue-500"
                />
                <p className="font-semibold text-lg">최대 어린이 수</p>
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
                  className="border border-gray-600 px-3 py-1 outline-none rounded-md flex-1 focus:border-blue-500"
                />
              </div>
              <p className="font-semibold text-lg">총 객실 수</p>
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
                className="input border border-gray-600 px-3 py-1 outline-none rounded-md focus:border-blue-500"
              />

              <p className="font-semibold text-lg">방 이미지 업로드</p>
              <div className="flex flex-wrap gap-2">
                {roomTypeImages[idx]?.map((file, imgIdx) => {
                  const imageUrl =
                    file instanceof File
                      ? URL.createObjectURL(file)
                      : file.imageUrl;

                  return (
                    <div key={imgIdx} className="relative w-24 h-24">
                      <Image
                        src={imageUrl}
                        alt="preview"
                        fill
                        className="object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-black text-white text-xs p-1"
                        onClick={() => {
                          const copy = [...roomTypeImages];
                          copy[idx] = copy[idx].filter((_, i) => i !== imgIdx);
                          setRoomTypeImages(copy);
                        }}
                      >
                        X
                      </button>
                    </div>
                  );
                })}
                {roomTypeImages[idx]?.length < 5 && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const copy = [...roomTypeImages];
                        copy[idx] = [...(copy[idx] || []), e.target.files[0]];
                        setRoomTypeImages(copy);
                      }
                    }}
                  />
                )}
              </div>

              <div className="border-t pt-10">
                <h4 className="font-bold text-xl">성수기 / 비수기 설정</h4>
                {room.seasonalPricing?.map((sp, spIdx) => (
                  <div key={spIdx} className="flex gap-2 items-center mb-1">
                    <input
                      type="date"
                      value={formateDate(sp.from)}
                      onChange={(e) => {
                        const updated = [...(room.seasonalPricing ?? [])];
                        updated[spIdx].from = e.target.value;
                        handleRoomTypeChange(idx, "seasonalPricing", updated);
                      }}
                      className="border border-gray-600 px-3 py-1 outline-none rounded-md"
                    />
                    <span>~</span>
                    <input
                      type="date"
                      value={formateDate(sp.to)}
                      onChange={(e) => {
                        const updated = [...(room.seasonalPricing ?? [])];
                        updated[spIdx].to = e.target.value;
                        handleRoomTypeChange(idx, "seasonalPricing", updated);
                      }}
                      className="border border-gray-600 px-3 py-1 outline-none rounded-md"
                    />
                    <p className="font-semibold text-lg">기본 가격</p>
                    <PriceInput
                      value={sp.basePrice}
                      onChange={(value) => {
                        const updated = [...(room.seasonalPricing ?? [])];
                        updated[spIdx].basePrice = value;
                        handleRoomTypeChange(idx, "seasonalPricing", updated);
                      }}
                      placeholder="평일가격"
                    />
                    <p className="font-semibold text-lg">주말 가격</p>
                    <PriceInput
                      value={sp.weekendPrice ?? 0}
                      onChange={(value) => {
                        const updated = [...(room.seasonalPricing ?? [])];
                        updated[spIdx].weekendPrice = value;
                        handleRoomTypeChange(idx, "seasonalPricing", updated);
                      }}
                      placeholder="주말가격"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (room.seasonalPricing ?? []).filter(
                          (_, i) => i !== spIdx
                        );
                        handleRoomTypeChange(idx, "seasonalPricing", updated);
                      }}
                      className="bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="text-sm text-blue-600 mt-1 hover:underline"
                  onClick={() => {
                    const newPricing = [
                      ...(room.seasonalPricing ?? []),
                      {
                        from: "",
                        to: "",
                        price: 0,
                        type: "PEAK" as const,
                      },
                    ];
                    handleRoomTypeChange(idx, "seasonalPricing", newPricing);
                  }}
                >
                  + 성수기/비수기 추가
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddRoomType}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + 방 유형 추가
          </button>
        </div>

        <div className="space-y-4 mt-10">
          <h3 className="text-2xl font-bold">티켓 타입</h3>

          {ticketTypes.map((ticket, idx) => (
            <div
              key={idx}
              className="border p-4 rounded border-gray-400 space-y-2 shadow-md"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-xl">티켓 {idx + 1}</p>
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTicketType(idx)}
                    className="bg-red-600 text-white text-md px-3 py-1 rounded hover:bg-red-700"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="font-semibold text-lg">이름</p>
              <input
                value={ticket.name}
                onChange={(e) =>
                  handleTicketTypeChange(idx, "name", e.target.value)
                }
                className="input border border-gray-600 px-3 py-1 outline-none rounded-md focus:border-blue-500"
              />
              <p className="font-semibold text-lg">설명</p>
              <textarea
                value={ticket.description ?? ""}
                onChange={(e) =>
                  handleTicketTypeChange(idx, "description", e.target.value)
                }
                className="w-full border border-gray-400 px-4 py-3 rounded-md resize-y min-h-[80px] focus:border-blue-500 focus:outline-none"
              />

              <div className="flex gap-2">
                <div className="flex flex-col flex-1">
                  <p className="font-semibold text-lg">성인 가격</p>
                  <PriceInput
                    value={ticket.adultPrice}
                    onChange={(value) =>
                      handleTicketTypeChange(idx, "adultPrice", Number(value))
                    }
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="font-semibold text-lg">어린이 가격</p>
                  <PriceInput
                    value={ticket.childPrice}
                    onChange={(value) =>
                      handleTicketTypeChange(idx, "childPrice", Number(value))
                    }
                  />
                </div>
              </div>

              <p className="font-semibold text-lg">총 티켓 수량</p>
              <p>성인 티켓 수</p>
              <input
                type="number"
                value={ticket.totalAdultTickets}
                onChange={(e) =>
                  handleTicketTypeChange(
                    idx,
                    "totalAdultTickets",
                    Number(e.target.value)
                  )
                }
                className="border border-gray-600 px-3 py-1 outline-none rounded-md focus:border-blue-500"
              />
              <p>어린이 티켓 수</p>
              <input
                type="number"
                value={ticket.totalChildTickets}
                onChange={(e) =>
                  handleTicketTypeChange(
                    idx,
                    "totalChildTickets",
                    Number(e.target.value)
                  )
                }
                className="border border-gray-600 px-3 py-1 outline-none rounded-md focus:border-blue-500"
              />
            </div>
          ))}

          <button type="button" onClick={handleAddTicketType}>
            + 티켓 추가
          </button>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {mode === "create" ? "숙소 등록" : "숙소 수정"}
        </button>
      </form>
    </div>
  );
};

export default LodgeForm;
