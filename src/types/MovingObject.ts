/**
 * Represents a moving object/element on the screen
 * Contains display data and interaction configuration
 */
export interface MovingObject {
  /** Path to the image asset */
  image: string;
  /** External form link (opens in new tab) - if null, image opens popup instead */
  formLink: string | null;
  /** Ticket purchase link (currently unused but reserved) */
  ticketsLink: string | null;
  /** Google Maps location link */
  location: string | null;
  /** Detailed description shown in popup modal */
  description?: string;
  /** Selection weight for weighted random selection (higher = more likely) */
  weight?: number;
}
