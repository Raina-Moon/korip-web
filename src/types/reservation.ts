import { RoomType } from "./lodge";

export interface Reservation {
  id: number;
  lodgeId: number;
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomCount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  cancelReason: "AUTO_EXPIRED" | "USER_REQUESTED" | "ADMIN_FORCED" | null;
  createdAt: string;
  lodge: {
    id: number;
    name: string;
    address: string;
  };
  roomType: RoomType;
  user: {
    id: number;
    nickname: string;
    email: string;
  } | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string | null;
  nationality?: string | null;
  totalPrice: number;
  specialRequests?: string | null;
}

export interface RoomTypeImage {
  id: number;
  imageUrl: string;
}
