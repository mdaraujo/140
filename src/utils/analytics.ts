/*
 * Lightweight analytics helpers that only emit events on production hostnames.
 * Designed to minimize GTM logic by pushing well-structured dataLayer events.
 */

interface GtagFunction {
  (command: 'event', eventName: string, params?: Record<string, unknown>): void;
  (command: 'config', measurementId: string, params?: Record<string, unknown>): void;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
  }
}

function isProdHostname(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === '140.pt' || hostname === 'www.140.pt';
}

function ensureDataLayer(): unknown[] {
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  return window.dataLayer;
}

export function track(eventName: string, params?: Record<string, unknown>): void {
  if (!isProdHostname()) return;
  const payload: Record<string, unknown> = {
    event: 'app_event',
    event_name: eventName,
  };
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      payload[key] = value;
    }
  }
  ensureDataLayer().push(payload);
}

export function trackModalOpen(details: {
  context: 'moving_element' | 'header';
  objectImage: string;
  hasTickets: boolean;
  hasLocation: boolean;
}): void {
  track('modal_open', {
    context: details.context,
    object_image: details.objectImage,
    has_tickets: details.hasTickets,
    has_location: details.hasLocation,
  });
}

export function trackCtaClick(details: {
  context: 'moving_element' | 'modal' | 'modal_image' | 'footer' | 'header';
  ctaType: 'tickets' | 'location' | 'form_link' | 'external_link';
  linkUrl: string;
  linkText?: string;
}): void {
  track('cta_click', {
    context: details.context,
    cta_type: details.ctaType,
    link_url: details.linkUrl,
    link_text: details.linkText,
  });
}
