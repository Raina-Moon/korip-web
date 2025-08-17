export type SupportStatus = "PENDING" | "ANSWERED";

export interface Support {
  id: number;
  userId: number;
  name: string;
  question: string;
  answer?: string | null;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
  answeredAt?: string | null;
}

export interface SupportPagination {
  data: Support[];
  total: number;
  page: number;
  limit: number;
}
