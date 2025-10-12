import { Position } from '../types/Position';
import { checkCollision, findNonCollidingPosition } from './collisionDetection';
import { ANIMATION_CONSTANTS } from '../data/constants';
import { isPositionDebugEnabled } from './debug';

function getMovingObjectSize(): number {
  const root = getComputedStyle(document.documentElement);
  const sizeVar = root.getPropertyValue('--moving-object-size').trim();
  const parsed = sizeVar.endsWith('px') ? parseFloat(sizeVar) : Number(sizeVar);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return ANIMATION_CONSTANTS.OBJECT_WIDTH;
}

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
  if (isPositionDebugEnabled()) {
    const areasPreview = restrictedAreas.slice(0, 3).map((a) => ({
      top: Math.round(a.top),
      left: Math.round(a.left),
      width: Math.round(a.width),
      height: Math.round(a.height),
    }));
    console.log('[position] generatePosition', {
      restrictedAreasCount: restrictedAreas.length,
      areasPreview,
      useCollisionDetection,
      maxAttempts,
    });
  }
  if (useCollisionDetection) {
    const currentSize = getMovingObjectSize();
    const collisionFreePosition = findNonCollidingPosition(
      existingPositions,
      restrictedAreas,
      {
        width: currentSize,
        height: currentSize,
      },
      maxAttempts,
    );

    if (collisionFreePosition) {
      if (isPositionDebugEnabled()) {
        console.log('[position] using heavy collision-free position', collisionFreePosition);
      }
      return collisionFreePosition;
    }
  }

  // Fallback: try a small number of random positions that avoid the restricted areas
  // and lightly check collisions to reduce overlaps
  // Pre-calculate reused values for performance
  const currentSize = getMovingObjectSize();
  const lightPadding = Math.max(
    ANIMATION_CONSTANTS.LIGHT_COLLISION_PADDING_MIN,
    Math.floor(currentSize * ANIMATION_CONSTANTS.LIGHT_COLLISION_PADDING_RATIO),
  );
  const halfWidth = currentSize / 2;
  const halfHeight = currentSize / 2;
  const lightPaddedWidth = currentSize + lightPadding * 2;
  const lightPaddedHeight = currentSize + lightPadding * 2;
  const viewportWidth = window.innerWidth * ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO;
  const viewportHeight = window.innerHeight * ANIMATION_CONSTANTS.VIEWPORT_USAGE_RATIO;
  let rejectedByRestricted = 0;
  let rejectedByCollision = 0;
  for (let attempt = 0; attempt < ANIMATION_CONSTANTS.LIGHT_COLLISION_TRIES; attempt++) {
    const candidate = generateRandomCandidate(viewportWidth, viewportHeight);
    // Skip if candidate overlaps any restricted area
    const overlapsRestricted = restrictedAreas.some((area) =>
      topLeftWidthHeightOverlap(
        candidate.top - halfHeight,
        candidate.left - halfWidth,
        currentSize,
        currentSize,
        area,
      ),
    );
    if (overlapsRestricted) {
      rejectedByRestricted += 1;
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
      if (isPositionDebugEnabled()) {
        console.log('[position] using light fallback position', {
          attempt: attempt + 1,
          rejectedByRestricted,
          rejectedByCollision,
          candidate,
        });
      }
      return candidate;
    }
    rejectedByCollision += 1;
  }

  // Final simple fallback
  const finalCandidate = generateRandomCandidate(viewportWidth, viewportHeight);
  if (isPositionDebugEnabled()) {
    console.log('[position] using final random fallback', {
      rejectedByRestricted,
      rejectedByCollision,
      finalCandidate,
    });
  }
  return finalCandidate;
}

/**
 * Generate a completely random position, avoiding only the restricted area
 * @param restrictedArea Area to avoid (e.g., main text)
 * @returns A random position
 */
function generateRandomCandidate(viewportWidth: number, viewportHeight: number): Position {
  const size = getMovingObjectSize();
  const halfWidth = size / 2;
  const halfHeight = size / 2;

  const usableWidth = viewportWidth - size;
  const usableHeight = viewportHeight - size;
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
