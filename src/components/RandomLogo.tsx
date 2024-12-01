import React, { useState, useEffect } from 'react';

interface RandomLogoProps {
  logos: string[];
  link: string;
  restrictedArea: DOMRect | null;
}

interface Position {
  top: number;
  left: number;
}

const RandomLogo: React.FC<RandomLogoProps> = ({
  logos,
  link,
  restrictedArea,
}) => {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [currentLogo, setCurrentLogo] = useState<string>('');

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

  const getRandomLogo = (): string =>
    logos[Math.floor(Math.random() * logos.length)];

  useEffect(() => {
    // Set initial position and logo
    setPosition(getRandomPosition());
    setCurrentLogo(getRandomLogo());

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
  }, [logos, restrictedArea]);

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
      <a href={link} target="_blank" rel="noopener noreferrer">
        {currentLogo && (
          <img
            src={currentLogo}
            alt="140 Logo"
            style={{
              width: '50px',
              height: '50px',
              transition: 'transform 0.3s ease',
            }}
            className="logo-hover"
          />
        )}
      </a>
    </div>
  );
};

export default RandomLogo;
