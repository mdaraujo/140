export interface EventItem {
  id: string;
  name: string;
  description?: string;
  image: string;
  formLink?: string | null;
  ticketsLink?: string | null;
  location?: string | null;
  startAt: string; // ISO 8601
  endAt: string; // ISO 8601
  weight?: number;
}


