import React, { useState, useEffect, useCallback, useRef } from 'react';
import './MovingElement.css';
import { MovingObject } from '../../types/MovingObject';
import { Position } from '../../types/Position';
import { AnimationInterval } from '../../types/ResponsiveConfig';
import { selectWeightedRandom } from '../../utils/weightedSelection';
import { generatePosition } from '../../utils/positionHelpers';
import { useMovingObjects } from '../../contexts/MovingObjectsContext';
import { ANIMATION_CONSTANTS } from '../../data/constants';
import { trackCtaClick, trackModalOpen } from '../../utils/analytics';
import { isPositionDebugEnabled } from '../../utils/debug';

interface MovingElementProps {
  elementId: string;
  movingObjects: MovingObject[];
  onClick: (movingObject: MovingObject) => void;
  restrictedAreas?: DOMRect[];
  isFirst?: boolean;
  randomizeFirst?: boolean;
  selectionCountsRef: React.MutableRefObject<Map<string, number>>;
  animationInterval?: AnimationInterval;
  existingPositions: Map<string, Position>;
  onPositionUpdate: (elementId: string, position: Position) => void;
  onRemove: (elementId: string) => void;
}

const MovingElement: React.FC<MovingElementProps> = ({
  elementId,
  movingObjects,
  onClick,
  restrictedAreas = [],
  isFirst = false,
  randomizeFirst = false,
  selectionCountsRef,
  animationInterval = { min: 3500, max: 6000 },
  existingPositions,
  onPositionUpdate,
  onRemove,
}) => {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [currentMovingObject, setCurrentMovingObject] = useState<MovingObject>();
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [shouldCue, setShouldCue] = useState<boolean>(false);
  const hasSetInitialImage = useRef(false);
  const objectPositionsRef = useRef(existingPositions);
  const lastMoveIdRef = useRef<number>(0);
  const cueTimeoutRef = useRef<number | null>(null);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get weighted random pick tracking from context
  const { logRandomPick } = useMovingObjects();

  // Update ref with current positions
  useEffect(() => {
    objectPositionsRef.current = existingPositions;
  }, [existingPositions]);

  // Schedule a cue shortly after a move finishes (only sometimes)
  const scheduleCueAfterMove = useCallback((moveId: number) => {
    // Get transition duration from CSS custom property (fallback to 500ms)
    const durationStr = getComputedStyle(document.documentElement)
      .getPropertyValue('--duration-position')
      .trim();
    const transitionMs = durationStr
      ? Math.max(0, Math.floor(parseFloat(durationStr) * 1000))
      : 500;
    const extraDelay = 300 + Math.random() * 900; // 0.3s - 1.2s after movement
    const totalDelay = transitionMs + extraDelay;

    if (cueTimeoutRef.current) {
      window.clearTimeout(cueTimeoutRef.current);
      cueTimeoutRef.current = null;
    }

    cueTimeoutRef.current = window.setTimeout(() => {
      // Only cue if no newer move has started
      if (lastMoveIdRef.current !== moveId) return;
      // Randomize whether to cue this time to avoid overuse
      if (Math.random() < 0.55) {
        setShouldCue(true);
        // Remove cue after CSS animation ends (~2s)
        const cueDurationMs = 2000;
        window.setTimeout(() => {
          if (lastMoveIdRef.current === moveId) {
            setShouldCue(false);
          }
        }, cueDurationMs);
      }
    }, totalDelay);
  }, []);

  const getPosition = useCallback(
    (useCurrentPositions: boolean = false): Position => {
      const positions = useCurrentPositions ? objectPositionsRef.current : existingPositions;
      const pos = generatePosition(
        positions,
        restrictedAreas,
        true, // Use collision detection
        ANIMATION_CONSTANTS.COLLISION_ATTEMPTS_MOVEMENT,
      );
      if (isPositionDebugEnabled()) {
        console.log('[moving] getPosition', {
          elementId,
          useCurrentPositions,
          restrictedAreasCount: restrictedAreas?.length ?? 0,
          pos,
        });
      }
      return pos;
    },
    [restrictedAreas, existingPositions, elementId],
  );

  const getRandomObject = useCallback((): MovingObject => {
    const picked = selectWeightedRandom(movingObjects, selectionCountsRef.current);

    logRandomPick(picked);
    return picked;
  }, [movingObjects, selectionCountsRef, logRandomPick]);

  // Set initial image only once
  useEffect(() => {
    if (!hasSetInitialImage.current) {
      if (isFirst && !randomizeFirst) {
        const firstObject = movingObjects[0];
        logRandomPick(firstObject);
        setCurrentMovingObject(firstObject);
      } else {
        setCurrentMovingObject(getRandomObject());
      }
      hasSetInitialImage.current = true;
    }
  }, [isFirst, randomizeFirst, movingObjects, getRandomObject, selectionCountsRef, logRandomPick]);

  // Handle position changes and animations
  useEffect(() => {
    // Capture existing positions only once at mount to avoid re-positioning
    const positionsAtMount = new Map(existingPositions);

    // Set initial position with collision detection
    const initialPosition = generatePosition(
      positionsAtMount,
      restrictedAreas,
      true, // Use collision detection
      ANIMATION_CONSTANTS.COLLISION_ATTEMPTS_INITIAL,
    );
    if (isPositionDebugEnabled()) {
      console.log('[moving] initialPosition', {
        elementId,
        restrictedAreasCount: restrictedAreas?.length ?? 0,
        initialPosition,
      });
    }
    setPosition(initialPosition);
    onPositionUpdate(elementId, initialPosition);
    // Consider initial placement as a move end
    lastMoveIdRef.current += 1;
    scheduleCueAfterMove(lastMoveIdRef.current);

    // Trigger move animation after the component mounts
    setTimeout(() => {
      const newPosition = getPosition();
      setPosition(newPosition);
      onPositionUpdate(elementId, newPosition);
      lastMoveIdRef.current += 1;
      scheduleCueAfterMove(lastMoveIdRef.current);
    }, ANIMATION_CONSTANTS.POSITION_UPDATE_DELAY);

    // Change position at random intervals with lightweight collision detection
    const scheduleNextMove = () => {
      const randomDelay =
        Math.random() * (animationInterval.max - animationInterval.min) + animationInterval.min;

      return setTimeout(() => {
        const newPosition = getPosition(true); // Use current positions
        setPosition(newPosition);
        onPositionUpdate(elementId, newPosition);
        lastMoveIdRef.current += 1;
        scheduleCueAfterMove(lastMoveIdRef.current);
        // Schedule the next move with a new random interval
        moveTimeoutRef.current = scheduleNextMove();
      }, randomDelay);
    };

    moveTimeoutRef.current = scheduleNextMove();

    // Cleanup function
    return () => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
        moveTimeoutRef.current = null;
      }
      onRemove(elementId);
      if (cueTimeoutRef.current) {
        window.clearTimeout(cueTimeoutRef.current);
        cueTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    animationInterval,
    elementId,
    onPositionUpdate,
    onRemove,
    // Note: getPosition not included to prevent re-positioning cascade
  ]);

  const handleAnchorClick = useCallback(() => {
    setIsPinned(true);
    if (!currentMovingObject?.formLink) return;
    trackCtaClick({
      context: 'moving_element',
      ctaType: 'form_link',
      linkUrl: currentMovingObject.formLink as string,
    });
  }, [currentMovingObject]);

  const handleImageClick = useCallback(() => {
    if (!currentMovingObject) return;
    setIsPinned(true);
    onClick(currentMovingObject);
    trackModalOpen({
      context: 'moving_element',
      objectImage: currentMovingObject.image,
      hasTickets: !!currentMovingObject.ticketsLink,
      hasLocation: !!currentMovingObject.location,
    });
  }, [currentMovingObject, onClick]);

  const handleImageKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLImageElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!currentMovingObject) return;
        setIsPinned(true);
        onClick(currentMovingObject);
        trackModalOpen({
          context: 'moving_element',
          objectImage: currentMovingObject.image,
          hasTickets: !!currentMovingObject.ticketsLink,
          hasLocation: !!currentMovingObject.location,
        });
      }
    },
    [currentMovingObject, onClick],
  );

  return (
    <div
      className="shadow-link moving-element"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {currentMovingObject?.formLink && (
        <a
          href={currentMovingObject.formLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAnchorClick}
        >
          <img
            src={currentMovingObject.image}
            alt="140"
            className={`moving-element-hover ${isPinned ? 'pinned' : ''}`}
          />
        </a>
      )}

      {!currentMovingObject?.formLink && currentMovingObject?.image && (
        <img
          src={currentMovingObject.image}
          alt="140"
          role="button"
          tabIndex={0}
          aria-label="Abrir detalhes"
          className={`moving-element-hover ${isPinned ? 'pinned' : ''} ${
            shouldCue && !isPinned ? 'attention-cue' : ''
          }`}
          onClick={handleImageClick}
          onKeyDown={handleImageKeyDown}
        />
      )}
    </div>
  );
};

export default MovingElement;
