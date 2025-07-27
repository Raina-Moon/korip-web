import { Review } from "./reivew";

export interface ReviewReport {
  id: number;
  reason: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
  };
  review: Review;
  isTicket: false;
}
