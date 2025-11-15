/**
 * Represents a moving object/element on the screen
 * Contains display data and interaction configuration
 */
export interface MovingObject {
  /** Path to the image asset */
  image: string;
  /** Optional image to use inside the modal (fallbacks to image) */
  modalImage?: string;
  /** Optional title of the event (used in CTAs, emails, etc.) */
  title?: string;
  /** Optional ISO date for the event start (for email prefill, etc.) */
  startAt?: string;
  /** External form link (opens in new tab) - if null, image opens popup instead */
  formLink: string | null;
  /** Ticket purchase link (currently unused but reserved) */
  ticketsLink: string | null;
  /** Location object (name + map URL) */
  location?: import('../data/locations').LocationInfo | null;
  /** Detailed description shown in popup modal */
  description?: string;
  /** Weight for weighted random algorithm (higher = more likely to be picked) */
  weight?: number;
}
