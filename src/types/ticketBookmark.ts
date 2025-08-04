export interface TicketBookmark {
  id: number;
  ticketTypeId: number;
  ticketType: {
    id: number;
    name: string;
    description?: string;
    lodge?: {
      name: string;
      address: string;
    };
  };
}
