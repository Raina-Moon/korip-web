import { TicketReservation } from "./ticketReservation";

export interface TicketReview {
  id: number;
  ticketTypeId: number;
  ticketReservationId?: number;
  userId: number;
  rating: number;
  comment?: string;
  originalLang?: "EN" | "KO" | null;
  enTranslated?: string | null;
  koTranslated?: string | null;
  createdAt: string;
  isHidden: boolean;
  user: {
    nickname: string;
  };
  reservation?: TicketReservation | null;
  ticketType?: {
    id: number;
    name: string;
  };
}
