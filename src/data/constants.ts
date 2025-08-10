export const LOCATIONS = {
  cafeSociedade: 'https://maps.app.goo.gl/6b4hyN2v7zgYSLDb7',
  fidelis: 'https://maps.app.goo.gl/vGUHBfTgUpr96E7z7',
  gumaJazz: 'https://maps.app.goo.gl/2SQxqcDrJwXRiRz98',
};

export const FORMS = {
  fichaSocio: 'https://forms.gle/dgnQgUeGjRHgjG2E7',
  gumaJazz: 'https://forms.gle/9GpUC4mz8hfMp1S38',
};

// Animation and Layout Constants
export const ANIMATION_CONSTANTS = {
  // Object dimensions
  OBJECT_WIDTH: 80,
  OBJECT_HEIGHT: 80,

  // Collision detection
  COLLISION_PADDING: 20,
  COLLISION_ATTEMPTS_INITIAL: 50,
  COLLISION_ATTEMPTS_MOVEMENT: 30,

  // Lightweight collision search (fallback/default) parameters
  LIGHT_COLLISION_TRIES: 30,
  LIGHT_COLLISION_PADDING_MIN: 8, // px
  LIGHT_COLLISION_PADDING_RATIO: 0.1, // of OBJECT_WIDTH

  // Heavy search padding scaling (object-object spacing buffer)
  HEAVY_COLLISION_PADDING_RATIO: 0.12, // of OBJECT_WIDTH

  // Viewport usage
  VIEWPORT_USAGE_RATIO: 0.9,

  // Timing
  POSITION_UPDATE_DELAY: 100, // ms delay for first position update

  // Transition styles
  POSITION_TRANSITION_DURATION: '0.5s',
  TRANSFORM_TRANSITION_DURATION: '0.3s',
};
