import { Reservation } from "@/types/reservation";
import { getLocalizedField } from "./getLocalizedField";

export const getLocalizedReservationLodgeName = (
  reservation: Reservation,
  locale: string
): string => {
  return getLocalizedField(
    reservation.lodge.name,
    reservation.lodge.nameEn,
    locale
  );
};

export const getLocalizedReservationRoomName = (
  reservation: Reservation,
  locale: string
): string => {
  return getLocalizedField(
    reservation.roomType.name,
    reservation.roomType.nameEn,
    locale
  );
};
