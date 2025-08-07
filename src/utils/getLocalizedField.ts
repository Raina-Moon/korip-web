export const getLocalizedField = (
  ko: string | null | undefined,
  en: string | null | undefined,
  locale: string
): string => {
  if (locale.startsWith("ko")) return ko ?? "";
  if (locale.startsWith("en")) return en ?? "";
  return ko ?? "";
};
