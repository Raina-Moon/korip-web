import { Review } from "@/types/reivew";
import { TicketReview } from "@/types/ticketReview";
import { getLocalizedField } from "./getLocalizedField";

type GenericReview = Review | TicketReview;

export const getLocalizedComment = (
  review: GenericReview,
  locale: string
): string => {
  return getLocalizedField(review.koTranslated, review.enTranslated, locale) 
    || review.comment 
    || "";
};
