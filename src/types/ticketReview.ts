import { TicketReservation } from "./ticketReservation";

export interface TicketReview {
  id: number;
  ticketTypeId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  isHidden: boolean;
  user: {
    nickname: string;
  };
  ticketReservation?: TicketReservation | null;
}
