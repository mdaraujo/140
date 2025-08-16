/**
 * Centralized application configuration
 * All constants and configuration values in one place
 */

// Animation and timing configuration
export const ANIMATION_CONFIG = {
  // Object dimensions (keep synchronized with CSS)
  object: {
    width: 80, // px - matches .moving-element img width
    height: 80, // px - auto height based on width ratio
  },

  // Collision detection settings
  collision: {
    // Initial placement (more thorough)
    initialAttempts: 50,
    padding: 20, // px - minimum space around objects
    heavyPaddingRatio: 0.12, // multiplier of object width for object-object spacing

    // Movement collision (lighter/faster)
    movementAttempts: 30,
    lightTries: 30,
    lightPaddingMin: 8, // px - minimum padding for light collision
    lightPaddingRatio: 0.1, // multiplier of object width
  },

  // Layout and positioning
  layout: {
    viewportUsageRatio: 0.9, // fraction of viewport to use for positioning
  },

  // Timing settings (CSS variables handle actual transition durations)
  timing: {
    positionUpdateDelay: 100, // ms - delay before first position update
  },
} as const;

// Responsive breakpoints and configuration
export const RESPONSIVE_CONFIG = {
  // Breakpoints (in pixels)
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
  },

  // Moving objects configuration per screen size
  movingObjects: {
    mobile: {
      maxObjects: 3,
      animationInterval: { min: 3000, max: 6000 },
    },
    tablet: {
      maxObjects: 5,
      animationInterval: { min: 2500, max: 5000 },
    },
    desktop: {
      maxObjects: 7,
      animationInterval: { min: 2000, max: 4000 },
    },
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Modal settings
  modal: {
    defaultCloseOnEscape: true,
    defaultCloseOnBackdrop: true,
    animationDuration: 300, // ms - sync with CSS transitions
  },

  // Z-index layering
  zIndex: {
    movingElements: 1,
    header: 10,
    footer: 10,
    modal: 1000,
  },
} as const;

// External links and forms
export const EXTERNAL_LINKS = {
  // Google Maps locations
  locations: {
    cafeSociedade: 'https://maps.app.goo.gl/6b4hyN2v7zgYSLDb7',
    fidelis: 'https://maps.app.goo.gl/vGUHBfTgUpr96E7z7',
    gumaJazz: 'https://maps.app.goo.gl/KbuSZ5HesDFNqh5J9',
  },

  // Forms
  forms: {
    fichaSocio: 'https://forms.gle/dgnQgUeGjRHgjG2E7',
    gumaJazz: 'https://forms.gle/9GpUC4mz8hfMp1S38',
  },
} as const;

// Development settings
export const DEV_CONFIG = {
  // Testing and debugging
  enableTestingUtilities: true,
  logSelectionStats: true,
  selectionStatsInterval: 5, // Log stats every N selections
} as const;

// Combined configuration export
export const APP_CONFIG = {
  animation: ANIMATION_CONFIG,
  responsive: RESPONSIVE_CONFIG,
  ui: UI_CONFIG,
  links: EXTERNAL_LINKS,
  dev: DEV_CONFIG,
} as const;

// Type exports for better TypeScript support
export type AnimationConfig = typeof ANIMATION_CONFIG;
export type ResponsiveConfig = typeof RESPONSIVE_CONFIG;
export type UIConfig = typeof UI_CONFIG;
export type AppConfig = typeof APP_CONFIG;
