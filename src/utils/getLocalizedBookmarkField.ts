import { Lodge } from "@/types/lodge";

export function getLocalizedLodgeName(lodge: Lodge, locale: string): string {
  return locale === "en" && lodge.nameEn ? lodge.nameEn : lodge.name;
}
