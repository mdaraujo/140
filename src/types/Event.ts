export interface EventItem {
  id: string;
  name: string;
  description?: string;
  image: string;
  /** Optional array of content items to render on the event detail page */
  items?: import('./ContentItem').ContentItem[];
  formLink?: string | null;
  ticketsLink?: string | null;
  /** Location info (name + map URL) */
  location?: import('../data/locations').LocationInfo | null;
  startAt: string; // ISO 8601
  endAt: string; // ISO 8601
  weight?: number;
  isHeaderOnly?: boolean;
}
