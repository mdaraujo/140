import React, { useState, useEffect, useRef } from 'react';

import './App.css';
import MovingElement from './components/MovingElement';
import { MovingObject } from './types/MovingObject';
import { movingObjects, eAgoraObject } from './data/movingObjects';
import { FORMS } from './data/constants';
import { useTestingUtilities } from './hooks/useTestingUtilities';
import { useResponsiveMovingObjects } from './hooks/useResponsiveMovingObjects';

const App: React.FC = () => {
  const [movingObjectCount, setMovingObjectCount] = useState<number>(1); // Start with 1 moving object
  const [restrictedArea, setRestrictedArea] = useState<DOMRect | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [activeMovingObject, setActiveMovingObject] =
    useState<MovingObject | null>(null);
  const selectionCountsRef = useRef<Map<string, number>>(new Map());

  // Get responsive configuration based on screen size
  const responsiveConfig = useResponsiveMovingObjects();

  // Make testing functions available in browser console
  useTestingUtilities(movingObjects, selectionCountsRef);

  // Add new movingObjects at random intervals (responsive to screen size)
  useEffect(() => {
    if (movingObjectCount <= responsiveConfig.maxMovingObjects) {
      // Make the first moving objects appear faster, then slow down
      let minInterval, maxInterval;
      if (movingObjectCount < 2) {
        minInterval = 600; // 0.6s
        maxInterval = 1200; // 1.2s
      } else if (movingObjectCount < 4) {
        minInterval = responsiveConfig.animationInterval.min * 0.6; // Faster initial appearance
        maxInterval = responsiveConfig.animationInterval.max * 0.6;
      } else {
        minInterval = responsiveConfig.animationInterval.min;
        maxInterval = responsiveConfig.animationInterval.max;
      }
      const interval = setInterval(
        () => {
          setMovingObjectCount((count) =>
            Math.min(count + 1, responsiveConfig.maxMovingObjects),
          );
        },
        Math.random() * (maxInterval - minInterval) + minInterval,
      );
      return () => clearInterval(interval);
    }
  }, [movingObjectCount, responsiveConfig]);

  // Get the bounding box of the question paragraphs
  useEffect(() => {
    if (questionRef.current) {
      setRestrictedArea(questionRef.current.getBoundingClientRect());
    }
  }, []);

  function openPopUp(movingObject: MovingObject) {
    setActiveMovingObject(movingObject);
    setShowPopUp(true);
  }

  function closePopup() {
    setShowPopUp(false);
  }

  return (
    <>
      <div className="question" ref={questionRef}>
        <p
          className="rotate1 l1 shadow-link"
          onClick={() => openPopUp(eAgoraObject)}
        >
          E
        </p>
        <p className="l2 shadow-link" onClick={() => openPopUp(eAgoraObject)}>
          AGORA
        </p>
        <p
          className="rotate2 l3 shadow-link"
          onClick={() => openPopUp(eAgoraObject)}
        >
          ?
        </p>
      </div>

      {Array.from({ length: movingObjectCount }).map((_, index) => (
        <MovingElement
          key={index}
          movingObjects={movingObjects}
          onClick={(movingObject) => openPopUp(movingObject)}
          restrictedArea={restrictedArea}
          isFirst={movingObjectCount === 1}
          selectionCountsRef={selectionCountsRef}
          animationInterval={responsiveConfig.animationInterval}
        />
      ))}

      {showPopUp && (
        <div className="popup" onClick={closePopup}>
          {activeMovingObject?.ticketsLink ? (
            <div className="popup-content">
              <a href={activeMovingObject?.ticketsLink} target="_blank">
                <img src={activeMovingObject?.image} alt="Pop-up Poster" />
              </a>
              {activeMovingObject?.description && (
                <p className="artist-description">
                  {activeMovingObject.description}
                </p>
              )}
              <a
                href={activeMovingObject?.ticketsLink}
                target="_blank"
                className="button shadow-link"
              >
                E agora? Bilhetes aqui&nbsp;{' '}
                <i className="fa fa-ticket" aria-hidden="true"></i>
              </a>
            </div>
          ) : (
            <div className="popup-content">
              <img src={activeMovingObject?.image} alt="Pop-up Poster" />
              {activeMovingObject?.description && (
                <p className="artist-description">
                  {activeMovingObject.description}
                </p>
              )}
              <a
                href={activeMovingObject?.location || ''}
                target="_blank"
                className="button shadow-link"
              >
                Entrada Livre&nbsp;{' '}
                <i className="fa fa-map-marker" aria-hidden="true"></i>
              </a>
            </div>
          )}
        </div>
      )}

      <footer className="footer">
        <p>
          <strong>Associação 140</strong>
        </p>
        <p>Movimento Artístico e Sociocultural</p>
        <p>
          <a href={FORMS.fichaSocio} target="_blank">
            <strong>Torna-te sócio!</strong>
          </a>
        </p>
        <p>
          <i className="fa fa-instagram" aria-hidden="true"></i>
          &nbsp;
          <a
            href="https://www.instagram.com/cento.quarenta/"
            target="_blank"
            rel="noopener noreferrer"
          >
            cento.quarenta
          </a>
        </p>
        <p>
          <i className="fa fa-envelope-o" aria-hidden="true"></i>
          &nbsp;
          <a href="mailto:geral@140.pt">geral@140.pt</a>
        </p>
        <p>
          <i className="fa fa-copyright" aria-hidden="true"></i>
          &nbsp;2024-2025 Penafiel
        </p>
      </footer>
    </>
  );
};

export default App;
