/**
 * Represents a moving object/element on the screen
 * Contains display data and interaction configuration
 */
export interface MovingObject {
  /** Path to the image asset */
  image: string;
  /** Optional image to use inside the modal (fallbacks to image) */
  modalImage?: string;
  /** External form link (opens in new tab) - if null, image opens popup instead */
  formLink: string | null;
  /** Ticket purchase link (currently unused but reserved) */
  ticketsLink: string | null;
  /** Google Maps location link */
  location: string | null;
  /** Detailed description shown in popup modal */
  description?: string;
  /** Weight for weighted random algorithm (higher = more likely to be picked) */
  weight?: number;
}
