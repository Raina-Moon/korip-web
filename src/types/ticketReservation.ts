export interface TicketReservation {
  id: number;
  ticketTypeId: number;
  userId: number;
  date: string;
  adults: number;
  children: number;
  totalPrice?: number;
  createdAt: string;
  status: string;
  cancelReason?: string;

  firstName: string;
  lastName: string;
  nationality: string;
  phoneNumber: string;
  email?: string;
  specialRequests?: string;

  ticketType: {
    id: number;
    name: string;
  };

  user: {
    id: number;
    nickname: string;
    email: string;
  };
}
