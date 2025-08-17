/**
 * Interval configuration for random timing ranges
 */
export interface AnimationInterval {
  /** Minimum time in milliseconds */
  min: number;
  /** Maximum time in milliseconds */
  max: number;
}

/**
 * Configuration for responsive moving objects behavior
 * Determines how many objects to show and their timing based on screen size
 */
export interface ResponsiveConfig {
  /** Maximum number of moving objects to display simultaneously */
  maxMovingObjects: number;
  /** Random interval range for position updates */
  animationInterval: AnimationInterval;
}
