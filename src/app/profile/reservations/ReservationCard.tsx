import React from "react";

function ReservationCard({
  reservation,
  onClick,
}: {
  reservation: any;
  onClick: (r: any) => void;
}) {
  return (
    <div
      className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick(reservation)}
    >
      <h2 className="text-lg font-semibold mb-2">
        {reservation.lodge?.name || "이름 없는 숙소"}
      </h2>
      <p className="text-sm text-gray-700 mb-1">
        방 타입: {reservation.roomType?.name || "정보 없음"}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        체크인: {reservation.checkIn.slice(0, 10)}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        체크아웃: {reservation.checkOut.slice(0, 10)}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        성인 {reservation.adults}명, 어린이 {reservation.children}명
      </p>
      <p className="text-sm text-gray-700 mb-1">
        객실 수: {reservation.roomCount}
      </p>
      <p className="text-sm text-gray-500">
        예약일: {new Date(reservation.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

export default ReservationCard;
