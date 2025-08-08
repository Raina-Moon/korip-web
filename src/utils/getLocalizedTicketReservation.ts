import { TicketReservation } from "@/types/ticketReservation";
import { getLocalizedField } from "@/utils/getLocalizedField";

export const getLocalizedTicketTypeName = (
  reservation: Partial<TicketReservation>,
  locale: string
): string => {
  return getLocalizedField(
    reservation.ticketType?.name,
    reservation.ticketType?.nameEn,
    locale
  );
};

export const getLocalizedLodgeNameFromTicket = (
  reservation: Partial<TicketReservation>,
  locale: string
): string => {
  return getLocalizedField(
    reservation.ticketType?.lodge?.name,
    reservation.ticketType?.lodge?.nameEn,
    locale
  );
};
