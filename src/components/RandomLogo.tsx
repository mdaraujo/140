import React, { useState, useEffect } from 'react';
import { MovingObject } from '../types/MovingObject';

interface RandomLogoProps {
  movingObjects: MovingObject[];
  onClick: (movingObject: MovingObject) => void;
  restrictedArea: DOMRect | null;
  isFirst?: boolean;
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
}) => {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [currentMovingObject, setcurrentMovingObject] =
    useState<MovingObject>();

  const getRandomPosition = (): Position => {
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

  const getRandomLogo = (): MovingObject =>
    movingObjects[Math.floor(Math.random() * movingObjects.length)];

  useEffect(() => {
    // Set initial position and logo
    setPosition(getRandomPosition());
    if (isFirst) {
      setcurrentMovingObject(movingObjects[0]);
    } else {
      setcurrentMovingObject(getRandomLogo());
    }

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
  }, [movingObjects, restrictedArea]);

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
