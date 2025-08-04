import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MovingObject } from '../types/MovingObject';
import { selectWeightedRandom } from '../utils/weightedSelection';
import { Position } from '../types/Position';
import { generatePosition } from '../utils/positionHelpers';
import { useSelectionLogging } from '../hooks/useSelectionLogging';
import { ANIMATION_CONSTANTS } from '../data/constants';

interface MovingElementProps {
  elementId: string;
  movingObjects: MovingObject[];
  onClick: (movingObject: MovingObject) => void;
  restrictedArea: DOMRect | null;
  isFirst?: boolean;
  selectionCountsRef: React.MutableRefObject<Map<string, number>>;
  animationInterval?: { min: number; max: number };
  existingPositions: Map<string, Position>;
  onPositionUpdate: (elementId: string, position: Position) => void;
  onRemove: (elementId: string) => void;
}

const MovingElement: React.FC<MovingElementProps> = ({
  elementId,
  movingObjects,
  onClick,
  restrictedArea,
  isFirst = false,
  selectionCountsRef,
  animationInterval = { min: 2000, max: 5000 },
  existingPositions,
  onPositionUpdate,
  onRemove,
}) => {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [currentMovingObject, setcurrentMovingObject] =
    useState<MovingObject>();
  const hasSetInitialImage = useRef(false);
  const objectPositionsRef = useRef(existingPositions);

  // Selection logging hook
  const { logSelection } = useSelectionLogging({
    movingObjects,
    selectionCountsRef,
  });

  // Update ref with current positions
  useEffect(() => {
    objectPositionsRef.current = existingPositions;
  }, [existingPositions]);

  const getPosition = useCallback(
    (useCurrentPositions: boolean = false): Position => {
      const positions = useCurrentPositions
        ? objectPositionsRef.current
        : existingPositions;
      return generatePosition(
        positions,
        restrictedArea,
        true, // Use collision detection
        ANIMATION_CONSTANTS.COLLISION_ATTEMPTS_MOVEMENT,
      );
    },
    [restrictedArea, existingPositions],
  );

  const getRandomLogo = useCallback((): MovingObject => {
    const selected = selectWeightedRandom(
      movingObjects,
      selectionCountsRef.current,
    );

    logSelection(selected);
    return selected;
  }, [movingObjects, selectionCountsRef, logSelection]);

  // Set initial image only once
  useEffect(() => {
    if (!hasSetInitialImage.current) {
      if (isFirst) {
        // For the first object, manually select and count the first item
        const firstObject = movingObjects[0];
        logSelection(firstObject);
        setcurrentMovingObject(firstObject);
      } else {
        setcurrentMovingObject(getRandomLogo());
      }
      hasSetInitialImage.current = true;
    }
  }, [isFirst, movingObjects, getRandomLogo, selectionCountsRef]);

  // Handle position changes and animations
  useEffect(() => {
    // Capture existing positions only once at mount to avoid re-positioning
    const positionsAtMount = new Map(existingPositions);

    // Set initial position with collision detection
    const initialPosition = generatePosition(
      positionsAtMount,
      restrictedArea,
      true, // Use collision detection
      ANIMATION_CONSTANTS.COLLISION_ATTEMPTS_INITIAL,
    );
    setPosition(initialPosition);
    onPositionUpdate(elementId, initialPosition);

    // Trigger move animation after the component mounts
    setTimeout(() => {
      const newPosition = getPosition();
      setPosition(newPosition);
      onPositionUpdate(elementId, newPosition);
    }, ANIMATION_CONSTANTS.POSITION_UPDATE_DELAY);

    // Change position at random intervals with lightweight collision detection
    const interval = setInterval(
      () => {
        const newPosition = getPosition(true); // Use current positions
        setPosition(newPosition);
        onPositionUpdate(elementId, newPosition);
      },
      Math.random() * (animationInterval.max - animationInterval.min) +
        animationInterval.min,
    );

    // Cleanup function
    return () => {
      clearInterval(interval);
      onRemove(elementId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    animationInterval,
    elementId,
    onPositionUpdate,
    onRemove,
    // Note: getPosition not included to prevent re-positioning cascade
  ]);

  return (
    <div
      className="shadow-link"
      style={{
        position: 'absolute',
        zIndex: 1,
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -50%)',
        transition: `top ${ANIMATION_CONSTANTS.POSITION_TRANSITION_DURATION} ease, left ${ANIMATION_CONSTANTS.POSITION_TRANSITION_DURATION} ease`,
      }}
    >
      {currentMovingObject?.formLink && (
        <a
          href={currentMovingObject.formLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={currentMovingObject.image}
            alt="140"
            style={{
              width: `${ANIMATION_CONSTANTS.OBJECT_WIDTH}px`,
              height: 'auto',
              transition: `transform ${ANIMATION_CONSTANTS.TRANSFORM_TRANSITION_DURATION} ease`,
            }}
            className="logo-hover"
          />
        </a>
      )}

      {!currentMovingObject?.formLink && currentMovingObject?.image && (
        <img
          src={currentMovingObject.image}
          alt="140"
          style={{
            width: `${ANIMATION_CONSTANTS.OBJECT_WIDTH}px`,
            height: 'auto',
            transition: `transform ${ANIMATION_CONSTANTS.TRANSFORM_TRANSITION_DURATION} ease`,
          }}
          className="logo-hover"
          onClick={() => onClick(currentMovingObject)}
        />
      )}
    </div>
  );
};

export default MovingElement;
