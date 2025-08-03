import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MovingObject } from '../types/MovingObject';
import { selectWeightedRandom } from '../utils/weightedSelection';

interface RandomLogoProps {
  movingObjects: MovingObject[];
  onClick: (movingObject: MovingObject) => void;
  restrictedArea: DOMRect | null;
  isFirst?: boolean;
  selectionCountsRef: React.MutableRefObject<Map<string, number>>;
}

interface Position {
  top: number;
  left: number;
}

const RandomLogo: React.FC<RandomLogoProps> = ({
  movingObjects,
  onClick,
  restrictedArea,
  isFirst = false,
  selectionCountsRef,
}) => {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [currentMovingObject, setcurrentMovingObject] =
    useState<MovingObject>();
  const hasSetInitialImage = useRef(false);

  const getRandomPosition = useCallback((): Position => {
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
  }, [restrictedArea]);

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
        setcurrentMovingObject(movingObjects[0]);
      } else {
        setcurrentMovingObject(getRandomLogo());
      }
      hasSetInitialImage.current = true;
    }
  }, [isFirst, movingObjects, getRandomLogo]);

  // Handle position changes and animations
  useEffect(() => {
    // Set initial position
    setPosition(getRandomPosition());

    // Trigger move animation after the component mounts
    setTimeout(() => {
      setPosition(getRandomPosition());
    }, 100);

    // Change position at random intervals
    const interval = setInterval(
      () => {
        setPosition(getRandomPosition());
      },
      Math.random() * 3000 + 2000,
    ); // Random interval between 2s and 5s

    return () => clearInterval(interval); // Cleanup interval
  }, [getRandomPosition]); // Only depend on position-related functions

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
            alt="140 Logo"
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
          alt="140 Logo"
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

export default RandomLogo;
