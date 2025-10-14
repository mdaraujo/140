export const LOCATIONS = {
  cafeSociedade: 'https://maps.app.goo.gl/6b4hyN2v7zgYSLDb7',
  fidelis: 'https://maps.app.goo.gl/vGUHBfTgUpr96E7z7',
  gumaJazz: 'https://maps.app.goo.gl/KbuSZ5HesDFNqh5J9',
  pontoC: 'https://maps.app.goo.gl/A42NBU42qjfrDHg18',
};

export const FORMS = {
  // Original share link (used for fallback/open in new tab)
  fichaSocio: 'https://forms.gle/dgnQgUeGjRHgjG2E7',
  // Embed-friendly URL for iframes
  fichaSocioEmbed:
    'https://docs.google.com/forms/d/e/1FAIpQLSdOoDJWoQyr5hBeSVZCLBmwwe8CDpKESzF9U27Fn8ZgM6R12Q/viewform?embedded=true',
  gumaJazz: 'https://forms.gle/9GpUC4mz8hfMp1S38',
};

// Animation and Layout Constants
export const ANIMATION_CONSTANTS = {
  // Object dimensions (keep synchronized with CSS)
  OBJECT_WIDTH: 80, // px - matches .moving-element img width
  OBJECT_HEIGHT: 80, // px - auto height based on width ratio

  // Collision detection - initial placement (more thorough)
  COLLISION_ATTEMPTS_INITIAL: 50,
  COLLISION_PADDING: 20, // px - minimum space around objects
  HEAVY_COLLISION_PADDING_RATIO: 0.12, // multiplier of OBJECT_WIDTH for object-object spacing

  // Collision detection - movement (lighter/faster)
  COLLISION_ATTEMPTS_MOVEMENT: 30,
  LIGHT_COLLISION_TRIES: 30,
  LIGHT_COLLISION_PADDING_MIN: 8, // px - minimum padding for light collision
  LIGHT_COLLISION_PADDING_RATIO: 0.1, // multiplier of OBJECT_WIDTH

  // Layout constraints
  VIEWPORT_USAGE_RATIO: 0.9, // fraction of viewport to use for positioning

  // Timing (transition durations in CSS variables)
  POSITION_UPDATE_DELAY: 100, // ms - delay before first position update
};
