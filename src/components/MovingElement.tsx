import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MovingObject } from '../types/MovingObject';
import { selectWeightedRandom } from '../utils/weightedSelection';
import {
  findNonCollidingPosition,
  Position,
} from '../utils/collisionDetection';

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

  // Update ref with current positions
  useEffect(() => {
    objectPositionsRef.current = existingPositions;
  }, [existingPositions]);

  const getRegularPosition = useCallback((): Position => {
    // Try lightweight collision detection first (fewer attempts)
    const newPosition = findNonCollidingPosition(
      existingPositions,
      restrictedArea,
      { width: 80, height: 80 },
      15, // Fewer attempts for better performance
    );

    if (newPosition) {
      return newPosition;
    }

    // Fallback: just avoid restricted area if collision detection fails
    let top, left;
    do {
      top = Math.random() * window.innerHeight * 0.9;
      left = Math.random() * window.innerWidth * 0.9;
    } while (
      restrictedArea &&
      top >= restrictedArea.top &&
      top <= restrictedArea.bottom &&
      left >= restrictedArea.left &&
      left <= restrictedArea.right
    );

    return { top, left };
  }, [restrictedArea, existingPositions]);

  const getRandomLogo = useCallback((): MovingObject => {
    const selected = selectWeightedRandom(
      movingObjects,
      selectionCountsRef.current,
    );

    // Update selection count
    const currentCount = selectionCountsRef.current.get(selected.image) || 0;
    const newCount = currentCount + 1;
    selectionCountsRef.current.set(selected.image, newCount);

    // Log selection with current counts
    const imageName = selected.image.split('/').pop() || 'unknown';
    const effectiveWeight = (selected.weight || 1) / newCount;

    console.log(
      `🎯 Selected: ${imageName} (count: ${newCount}, effective weight: ${effectiveWeight.toFixed(2)})`,
    );

    // Show all current counts every 5 selections
    const totalSelections = Array.from(
      selectionCountsRef.current.values(),
    ).reduce((sum, count) => sum + count, 0);
    if (totalSelections % 5 === 0) {
      console.log('\n📊 Current Selection Counts:');
      const allCounts = Array.from(selectionCountsRef.current.entries()).map(
        ([image, count]) => ({
          image: image.split('/').pop() || 'unknown',
          count,
          effectiveWeight:
            (movingObjects.find((obj) => obj.image === image)?.weight || 1) /
            (count + 1),
        }),
      );
      console.table(allCounts);
      console.log(`Total selections: ${totalSelections}\n`);
    }

    return selected;
  }, [movingObjects, selectionCountsRef]);

  // Set initial image only once
  useEffect(() => {
    if (!hasSetInitialImage.current) {
      if (isFirst) {
        // For the first object, manually select and count the first item
        const firstObject = movingObjects[0];
        const currentCount =
          selectionCountsRef.current.get(firstObject.image) || 0;
        const newCount = currentCount + 1;
        selectionCountsRef.current.set(firstObject.image, newCount);

        // Log the first selection
        const imageName = firstObject.image.split('/').pop() || 'unknown';
        const effectiveWeight = (firstObject.weight || 1) / newCount;
        console.log(
          `🎯 Selected (first): ${imageName} (count: ${newCount}, effective weight: ${effectiveWeight.toFixed(2)})`,
        );

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
    const initialPosition =
      findNonCollidingPosition(positionsAtMount, restrictedArea, {
        width: 80,
        height: 80,
      }) || getRegularPosition();
    setPosition(initialPosition);
    onPositionUpdate(elementId, initialPosition);

    // Trigger move animation after the component mounts
    setTimeout(() => {
      const newPosition = getRegularPosition();
      setPosition(newPosition);
      onPositionUpdate(elementId, newPosition);
    }, 100);

    // Change position at random intervals with lightweight collision detection
    const interval = setInterval(
      () => {
        // Create a fresh position function to use current positions
        const getLivePosition = () => {
          const newPosition = findNonCollidingPosition(
            objectPositionsRef.current,
            restrictedArea,
            { width: 80, height: 80 },
            15, // Fewer attempts for performance
          );

          if (newPosition) return newPosition;

          // Fallback without collision detection
          let top, left;
          do {
            top = Math.random() * window.innerHeight * 0.9;
            left = Math.random() * window.innerWidth * 0.9;
          } while (
            restrictedArea &&
            top >= restrictedArea.top &&
            top <= restrictedArea.bottom &&
            left >= restrictedArea.left &&
            left <= restrictedArea.right
          );
          return { top, left };
        };

        const newPosition = getLivePosition();
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
    // Note: getRegularPosition not included to prevent re-positioning cascade
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
        transition: 'top 0.5s ease, left 0.5s ease',
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
              width: '80px',
              height: 'auto',
              transition: 'transform 0.3s ease',
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
            width: '80px',
            height: 'auto',
            transition: 'transform 0.3s ease',
          }}
          className="logo-hover"
          onClick={() => onClick(currentMovingObject)}
        />
      )}
    </div>
  );
};

export default MovingElement;
