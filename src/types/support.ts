export type SupportStatus = "PENDING" | "ANSWERED";

export interface Support {
  id: number;
  userId: number;
  name: string;
  question: string;
  questionKo?: string | null;
  originalLang?: string | null;
  answer?: string | null;
  answerEn?: string | null;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
  answeredAt?: string | null;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface SupportPagination {
  data: Support[];
  total: number;
  page: number;
  limit: number;
}
