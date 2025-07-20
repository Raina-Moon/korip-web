export interface Ticket {
  lodgeImage: any;
  averageRating: any;
  reviewCount: number;
  id: number;
  name: string;
  description?: string;
  region: string;
  lodgeId: number;
  adultPrice: number;
  childPrice: number;
  availableAdultTickets: number;
  availableChildTickets: number;
  date: string;
  lodge: Lodge;
}

export interface TicketBookmark {
  id: number;
  ticketTypeId: number;
  userId: number;
  createdAt: string;
}

export interface TicketImage {
  id: number;
  imageUrl: string;
}

export interface Lodge {
  id: number;
  name: string;
  address: string;
  images: TicketImage[];
}

export interface TicketInventory {
  id: number;
  lodgeId: number;
  ticketTypeId: number;
  date: string;
  totalAdultTickets: number;
  availableAdultTickets: number;
  totalChildTickets: number;
  availableChildTickets: number;
}