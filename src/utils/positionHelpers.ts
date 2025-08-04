import { Position } from '../types/Position';
import { findNonCollidingPosition } from './collisionDetection';
import { ANIMATION_CONSTANTS } from '../data/constants';

/**
 * Generate a random position with optional collision detection
 * @param existingPositions Current positions of other objects
 * @param restrictedArea Area to avoid (e.g., main text)
 * @param useCollisionDetection Whether to attempt collision avoidance
 * @param maxAttempts Number of attempts for collision detection
 * @returns A position that avoids collisions if possible, otherwise a random position
 */
export function generatePosition(
  existingPositions: Map<string, Position>,
  restrictedArea: DOMRect | null,
  useCollisionDetection: boolean = true,
  maxAttempts: number = ANIMATION_CONSTANTS.COLLISION_ATTEMPTS_MOVEMENT,
): Position {
  if (useCollisionDetection) {
    const collisionFreePosition = findNonCollidingPosition(
      existingPositions,
      restrictedArea,
      {
        width: ANIMATION_CONSTANTS.OBJECT_WIDTH,
        height: ANIMATION_CONSTANTS.OBJECT_HEIGHT,
      },
      maxAttempts,
    );

    if (collisionFreePosition) {
      return collisionFreePosition;
    }
  }

  // Fallback: generate random position avoiding only restricted area
  return generateRandomPosition(restrictedArea);
}

/**
 * Generate a completely random position, avoiding only the restricted area
 * @param restrictedArea Area to avoid (e.g., main text)
 * @returns A random position
 */
function generateRandomPosition(restrictedArea: DOMRect | null): Position {
  let top, left;
  do {
    top =
      Math.random() *
      window.innerHeight *
      ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO;
    left =
      Math.random() *
      window.innerWidth *
      ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO;
  } while (
    restrictedArea &&
    top >= restrictedArea.top &&
    top <= restrictedArea.bottom &&
    left >= restrictedArea.left &&
    left <= restrictedArea.right
  );

  return { top, left };
}
