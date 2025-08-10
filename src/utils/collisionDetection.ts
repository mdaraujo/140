import { Position } from '../types/Position';

export interface ObjectBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Check if two rectangular areas overlap
 */
export function checkCollision(
  bounds1: ObjectBounds,
  bounds2: ObjectBounds,
): boolean {
  return !(
    bounds1.left + bounds1.width < bounds2.left ||
    bounds2.left + bounds2.width < bounds1.left ||
    bounds1.top + bounds1.height < bounds2.top ||
    bounds2.top + bounds2.height < bounds1.top
  );
}

import { ANIMATION_CONSTANTS } from '../data/constants';

/**
 * Find a position that doesn't collide with existing objects
 * @param existingPositions Array of current object positions
 * @param restrictedArea Area to avoid (e.g., main text)
 * @param objectSize Size of the object to place
 * @param maxAttempts Maximum number of attempts to find a position
 * @returns Non-colliding position or null if no position found
 */

export function findNonCollidingPosition(
  existingPositions: Map<string, Position>,
  restrictedArea: DOMRect | null,
  objectSize: { width: number; height: number } = {
    width: ANIMATION_CONSTANTS.OBJECT_WIDTH,
    height: ANIMATION_CONSTANTS.OBJECT_HEIGHT,
  },
  maxAttempts: number = ANIMATION_CONSTANTS.COLLISION_ATTEMPTS_INITIAL,
): Position | null {
  const viewportWidth =
    window.innerWidth * ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO;
  const viewportHeight =
    window.innerHeight * ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO;
  const padding = ANIMATION_CONSTANTS.COLLISION_PADDING;
  const halfWidth = objectSize.width / 2;
  const halfHeight = objectSize.height / 2;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const position: Position = {
      // Treat position as the CENTER of the object so it never overflows
      top: halfHeight + Math.random() * (viewportHeight - objectSize.height),
      left: halfWidth + Math.random() * (viewportWidth - objectSize.width),
    };

    // Check if position is in restricted area
    if (
      restrictedArea &&
      isPositionInRestrictedArea(position, objectSize, restrictedArea)
    ) {
      continue;
    }

    // Check collision with existing objects
    const newBounds: ObjectBounds = {
      // Convert center position to top-left bounds and include padding
      top: position.top - halfHeight - padding,
      left: position.left - halfWidth - padding,
      width: objectSize.width + padding * 2,
      height: objectSize.height + padding * 2,
    };

    let hasCollision = false;
    for (const existingPosition of existingPositions.values()) {
      const existingBounds: ObjectBounds = {
        top: existingPosition.top - halfHeight - padding,
        left: existingPosition.left - halfWidth - padding,
        width: objectSize.width + padding * 2,
        height: objectSize.height + padding * 2,
      };

      if (checkCollision(newBounds, existingBounds)) {
        hasCollision = true;
        break;
      }
    }

    if (!hasCollision) {
      console.log('position found', position);
      return position;
    }
  }

  // If no non-colliding position found, let caller fallback to
  // restricted-area-aware random placement
  return null;
}

/**
 * Check if a position overlaps with the restricted area
 */
function isPositionInRestrictedArea(
  position: Position,
  objectSize: { width: number; height: number },
  restrictedArea: DOMRect,
): boolean {
  const halfWidth = objectSize.width / 2;
  const halfHeight = objectSize.height / 2;
  const objectBounds: ObjectBounds = {
    // Convert center position to top-left bounds
    top: position.top - halfHeight,
    left: position.left - halfWidth,
    width: objectSize.width,
    height: objectSize.height,
  };

  const restrictedBounds: ObjectBounds = {
    top: restrictedArea.top,
    left: restrictedArea.left,
    width: restrictedArea.width,
    height: restrictedArea.height,
  };

  return checkCollision(objectBounds, restrictedBounds);
}
