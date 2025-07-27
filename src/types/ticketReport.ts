import { TicketReview } from "./ticketReview";

export interface TicketReport {
  id: number;
  reason: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
  };
  review: TicketReview;
  isTicket: true;
}
