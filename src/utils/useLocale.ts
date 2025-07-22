import { useParams } from "next/navigation";

export function useLocale() {
  const params = useParams();
  return typeof params.locale === "string" ? params.locale : params.locale?.[0] ?? "ko";
}
