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
}
