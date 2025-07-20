import { TicketReservation } from "./ticketReservation";

export interface TicketReview {
  id: number;
  ticketTypeId: number;
  ticketReservationId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  isHidden: boolean;
  user: {
    nickname: string;
  };
  reservation?: TicketReservation | null;
}
