export interface Review {
  id: number;
  lodgeId: number;
  userId: number;
  rating: number;
  content: string;
  createdAt: string;
  lodge: LodgeSummary;
}

export interface LodgeSummary {
  id: number;
  name: string;
  address: string;
  images: { imageUrl: string }[];
}
