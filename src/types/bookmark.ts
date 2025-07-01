import { Lodge } from "./lodge";

export interface Bookmark {
  id: string;
  userId: number;
  lodgeId: number;
  createdAt: string;
  lodge: Lodge;
}
