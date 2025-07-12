export interface Ticket {
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
  address: string;
  images: TicketImage[];
}