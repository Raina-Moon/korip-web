import { getLocalizedField } from "./getLocalizedField";

export const getLocalizedTicketName = (
  ticket: { name: string | null | undefined; nameEn?: string | null },
  locale: string
): string => {
  return getLocalizedField(ticket.name, ticket.nameEn, locale);
};

export const getLocalizedTicketDescription = (
  ticket: { description?: string | null; descriptionEn?: string | null },
  locale: string
): string => {
  return getLocalizedField(ticket.description, ticket.descriptionEn, locale);
};

export const getLocalizedLodgeNameFromLodgeWithTickets = (
  lodge: { name: string; nameEn?: string | null },
  locale: string
): string => {
  return getLocalizedField(lodge.name, lodge.nameEn, locale);
};