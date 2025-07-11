export interface Lodge {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  accommodationType: string;
  roomTypes: RoomType[];
  images: LodgeImage[];
  ticketTypes?: TicketType[];
}

export interface LodgeImage {
  id: number;
  lodgeId: number;
  imageUrl: string;
  publicId: string;
}

export interface RoomType {
  id?: number;
  name: string;
  description: string | null;
  basePrice: number;
  weekendPrice?: number;
  maxAdults: number;
  maxChildren: number;
  totalRooms: number;
  seasonalPricing?: SeasonalPricing[];
  images?: RoomTypeImage[];
}

export interface RoomTypeImage {
  id: number;
  roomTypeId: number;
  imageUrl: string;
  publicId: string;
}

export interface SeasonalPricing {
  id: number;
  from: string;
  to: string;
  basePrice: number;
  weekendPrice: number;
}

export interface RoomInventory {
  id: number;
  lodgeId: number;
  roomTypeId: number;
  date: string;
  availableRooms: number;
}

export interface RoomPricing {
  id: number;
  roomTypeId: number;
  date: string;
  price: number;
  priceType: "WEEKDAY" | "WEEKEND" | "PEAK" | "OFF";
}

export interface TicketType {
  id?: number;
  lodgeId?: number;
  name: string;
  description?: string;
  adultPrice: number;
  childPrice: number;
  totalAdultTickets: number;
  totalChildTickets: number;
}
