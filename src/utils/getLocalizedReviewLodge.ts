import { getLocalizedField } from "./getLocalizedField";

interface ReviewLodge {
  name: string | null | undefined;
  nameEn?: string | null | undefined;
}

export function getLocalizedReviewLodge(
  lodge: ReviewLodge,
  locale: string
): string {
  return getLocalizedField(lodge.name, lodge.nameEn, locale);
}
