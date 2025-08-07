import { Reservation } from "./reservation";

export interface Review {
  id: number;
  lodgeId: number;
  userId: number;
  rating: number;
  
  comment?: string | null;
  originalLang?: "EN" | "KO" | null;
  enTranslated?: string | null;
  koTranslated?: string | null;  

  createdAt: string;
  isHidden: boolean;
  lodge: LodgeSummary;
  reservationId?: number;
  user?: {
    id: number;
    nickname: string;
  };
  reservation?: Reservation;
}

export interface LodgeSummary {
  id: number;
  name: string;
  address?: string;
  images?: { imageUrl: string }[];
}
