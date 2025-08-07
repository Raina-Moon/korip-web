import { Review } from "@/types/reivew";
import { TicketReview } from "@/types/ticketReview";

type GenericReview = Review | TicketReview;

export const getLocalizedComment = (
  review: GenericReview,
  locale: string
): string => {
  if (locale.startsWith("ko")) return review.koTranslated ?? review.comment ?? "";
  if (locale.startsWith("en")) return review.enTranslated ?? review.comment ?? "";
  return review.comment ?? "";
};
