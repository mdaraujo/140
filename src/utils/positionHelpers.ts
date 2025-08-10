import { Position } from '../types/Position';
import { checkCollision, findNonCollidingPosition } from './collisionDetection';
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

  // Fallback: try a small number of random positions that avoid the restricted area
  // and lightly check collisions to reduce overlaps
  const lightPadding = Math.max(
    ANIMATION_CONSTANTS.LIGHT_COLLISION_PADDING_MIN,
    Math.floor(
      ANIMATION_CONSTANTS.OBJECT_WIDTH *
        ANIMATION_CONSTANTS.LIGHT_COLLISION_PADDING_RATIO,
    ),
  );
  const halfWidth = ANIMATION_CONSTANTS.OBJECT_WIDTH / 2;
  const halfHeight = ANIMATION_CONSTANTS.OBJECT_HEIGHT / 2;
  for (
    let attempt = 0;
    attempt < ANIMATION_CONSTANTS.LIGHT_COLLISION_TRIES;
    attempt++
  ) {
    const candidate = generateRandomPosition(restrictedArea);
    const candidateBounds = {
      top: candidate.top - halfHeight - lightPadding,
      left: candidate.left - halfWidth - lightPadding,
      width: ANIMATION_CONSTANTS.OBJECT_WIDTH + lightPadding * 2,
      height: ANIMATION_CONSTANTS.OBJECT_HEIGHT + lightPadding * 2,
    };

    let hasCollision = false;
    for (const pos of existingPositions.values()) {
      const existingBounds = {
        top: pos.top - halfHeight - lightPadding,
        left: pos.left - halfWidth - lightPadding,
        width: ANIMATION_CONSTANTS.OBJECT_WIDTH + lightPadding * 2,
        height: ANIMATION_CONSTANTS.OBJECT_HEIGHT + lightPadding * 2,
      };
      if (checkCollision(candidateBounds, existingBounds)) {
        hasCollision = true;
        break;
      }
    }

    if (!hasCollision) {
      return candidate;
    }
  }

  // Final simple fallback
  return generateRandomPosition(restrictedArea);
}

/**
 * Generate a completely random position, avoiding only the restricted area
 * @param restrictedArea Area to avoid (e.g., main text)
 * @returns A random position
 */
function generateRandomPosition(restrictedArea: DOMRect | null): Position {
  const halfWidth = ANIMATION_CONSTANTS.OBJECT_WIDTH / 2;
  const halfHeight = ANIMATION_CONSTANTS.OBJECT_HEIGHT / 2;
  let top, left;
  do {
    top =
      halfHeight +
      Math.random() *
        (window.innerHeight * ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO -
          ANIMATION_CONSTANTS.OBJECT_HEIGHT);
    left =
      halfWidth +
      Math.random() *
        (window.innerWidth * ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO -
          ANIMATION_CONSTANTS.OBJECT_WIDTH);
  } while (
    restrictedArea &&
    // Convert center-based position to object bounds and check overlap
    top - halfHeight < restrictedArea.bottom &&
    top + halfHeight > restrictedArea.top &&
    left - halfWidth < restrictedArea.right &&
    left + halfWidth > restrictedArea.left
  );

  return { top, left };
}
