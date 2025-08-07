import { Lodge } from "@/types/lodge";
import { getLocalizedField } from "@/utils/getLocalizedField";

export const getLocalizedLodgeName = (lodge: Lodge, locale: string): string => {
  return getLocalizedField(lodge.name, lodge.nameEn, locale);
};

export const getLocalizedLodgeDescription = (lodge: Lodge, locale: string): string => {
  return getLocalizedField(lodge.description, lodge.descriptionEn, locale);
};
