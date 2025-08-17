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
  restrictedAreas: DOMRect[] = [],
  useCollisionDetection: boolean = true,
  maxAttempts: number = ANIMATION_CONSTANTS.COLLISION_ATTEMPTS_MOVEMENT,
): Position {
  if (useCollisionDetection) {
    const collisionFreePosition = findNonCollidingPosition(
      existingPositions,
      restrictedAreas,
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

  // Fallback: try a small number of random positions that avoid the restricted areas
  // and lightly check collisions to reduce overlaps
  // Pre-calculate reused values for performance
  const lightPadding = Math.max(
    ANIMATION_CONSTANTS.LIGHT_COLLISION_PADDING_MIN,
    Math.floor(
      ANIMATION_CONSTANTS.OBJECT_WIDTH *
        ANIMATION_CONSTANTS.LIGHT_COLLISION_PADDING_RATIO,
    ),
  );
  const halfWidth = ANIMATION_CONSTANTS.OBJECT_WIDTH / 2;
  const halfHeight = ANIMATION_CONSTANTS.OBJECT_HEIGHT / 2;
  const lightPaddedWidth = ANIMATION_CONSTANTS.OBJECT_WIDTH + lightPadding * 2;
  const lightPaddedHeight =
    ANIMATION_CONSTANTS.OBJECT_HEIGHT + lightPadding * 2;
  const viewportWidth =
    window.innerWidth * ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO;
  const viewportHeight =
    window.innerHeight * ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO;
  for (
    let attempt = 0;
    attempt < ANIMATION_CONSTANTS.LIGHT_COLLISION_TRIES;
    attempt++
  ) {
    const candidate = generateRandomCandidate(viewportWidth, viewportHeight);
    // Skip if candidate overlaps any restricted area
    const overlapsRestricted = restrictedAreas.some((area) =>
      topLeftWidthHeightOverlap(
        candidate.top - halfHeight,
        candidate.left - halfWidth,
        ANIMATION_CONSTANTS.OBJECT_WIDTH,
        ANIMATION_CONSTANTS.OBJECT_HEIGHT,
        area,
      ),
    );
    if (overlapsRestricted) {
      continue;
    }
    const candidateBounds = {
      top: candidate.top - halfHeight - lightPadding,
      left: candidate.left - halfWidth - lightPadding,
      width: lightPaddedWidth,
      height: lightPaddedHeight,
    };

    let hasCollision = false;
    for (const pos of existingPositions.values()) {
      const existingBounds = {
        top: pos.top - halfHeight - lightPadding,
        left: pos.left - halfWidth - lightPadding,
        width: lightPaddedWidth,
        height: lightPaddedHeight,
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
  return generateRandomCandidate(viewportWidth, viewportHeight);
}

/**
 * Generate a completely random position, avoiding only the restricted area
 * @param restrictedArea Area to avoid (e.g., main text)
 * @returns A random position
 */
function generateRandomCandidate(
  viewportWidth: number,
  viewportHeight: number,
): Position {
  const halfWidth = ANIMATION_CONSTANTS.OBJECT_WIDTH / 2;
  const halfHeight = ANIMATION_CONSTANTS.OBJECT_HEIGHT / 2;

  const usableWidth = viewportWidth - ANIMATION_CONSTANTS.OBJECT_WIDTH;
  const usableHeight = viewportHeight - ANIMATION_CONSTANTS.OBJECT_HEIGHT;
  const left = halfWidth + Math.random() * usableWidth;
  const top = halfHeight + Math.random() * usableHeight;
  return { top, left };
}

function topLeftWidthHeightOverlap(
  top: number,
  left: number,
  width: number,
  height: number,
  area: DOMRect,
): boolean {
  const bounds = { top, left, width, height } as {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  const areaBounds = {
    top: area.top,
    left: area.left,
    width: area.width,
    height: area.height,
  };
  return checkCollision(bounds, areaBounds);
}
