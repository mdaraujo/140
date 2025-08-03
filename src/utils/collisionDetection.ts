export interface Position {
  top: number;
  left: number;
}

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
  objectSize: { width: number; height: number } = { width: 80, height: 80 },
  maxAttempts: number = 50,
): Position | null {
  const viewportWidth = window.innerWidth * 0.9;
  const viewportHeight = window.innerHeight * 0.9;
  const padding = 20; // Minimum distance between objects

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const position: Position = {
      top: Math.random() * (viewportHeight - objectSize.height),
      left: Math.random() * (viewportWidth - objectSize.width),
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
      top: position.top - padding,
      left: position.left - padding,
      width: objectSize.width + padding * 2,
      height: objectSize.height + padding * 2,
    };

    let hasCollision = false;
    for (const existingPosition of existingPositions.values()) {
      const existingBounds: ObjectBounds = {
        top: existingPosition.top - padding,
        left: existingPosition.left - padding,
        width: objectSize.width + padding * 2,
        height: objectSize.height + padding * 2,
      };

      if (checkCollision(newBounds, existingBounds)) {
        hasCollision = true;
        break;
      }
    }

    if (!hasCollision) {
      return position;
    }
  }

  // If no position found after max attempts, return a random position
  // This ensures the object still appears even if screen is crowded
  return {
    top: Math.random() * (viewportHeight - objectSize.height),
    left: Math.random() * (viewportWidth - objectSize.width),
  };
}

/**
 * Check if a position overlaps with the restricted area
 */
function isPositionInRestrictedArea(
  position: Position,
  objectSize: { width: number; height: number },
  restrictedArea: DOMRect,
): boolean {
  const objectBounds: ObjectBounds = {
    top: position.top,
    left: position.left,
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
