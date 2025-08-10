import React, { useState, useEffect, useRef, useCallback } from 'react';

import './App.css';
import MovingElement from './components/MovingElement';
import PopupModal from './components/PopupModal';
import { MovingObject } from './types/MovingObject';
import { movingObjects, eAgoraObject } from './data/movingObjects';
import { FORMS } from './data/constants';
import { useTestingUtilities } from './hooks/useTestingUtilities';
import { useResponsiveMovingObjects } from './hooks/useResponsiveMovingObjects';
import { useObjectSpawning } from './hooks/useObjectSpawning';

const App: React.FC = () => {
  const [movingObjectCount, setMovingObjectCount] = useState<number>(1); // Start with 1 moving object
  const [restrictedAreas, setRestrictedAreas] = useState<DOMRect[]>([]);
  const questionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [activeMovingObject, setActiveMovingObject] =
    useState<MovingObject | null>(null);
  const selectionCountsRef = useRef<Map<string, number>>(new Map());

  // Shared position tracking for collision detection
  const objectPositionsRef = useRef<Map<string, { top: number; left: number }>>(
    new Map(),
  );

  // Get responsive configuration based on screen size
  const responsiveConfig = useResponsiveMovingObjects();

  // Make testing functions available in browser console
  useTestingUtilities(movingObjects, selectionCountsRef);

  // Handle object spawning timing
  useObjectSpawning({
    movingObjectCount,
    setMovingObjectCount,
    responsiveConfig,
  });

  // Get the bounding boxes of the individual question and footer texts
  useEffect(() => {
    if (!questionRef.current || !footerRef.current) return;

    function getTextLineRects(container: Element): DOMRect[] {
      const rects: DOMRect[] = [];
      const paragraphs = Array.from(container.querySelectorAll('p'));
      for (const p of paragraphs) {
        const range = document.createRange();
        range.selectNodeContents(p);
        const clientRects = Array.from(range.getClientRects());
        for (const r of clientRects) {
          rects.push(new DOMRect(r.left, r.top, r.width, r.height));
        }
        range.detach?.();
      }
      return rects;
    }

    const questionRects = getTextLineRects(questionRef.current);
    const footerRects = getTextLineRects(footerRef.current);
    setRestrictedAreas([...questionRects, ...footerRects]);
  }, []);

  function openPopUp(movingObject: MovingObject) {
    setActiveMovingObject(movingObject);
    setShowPopUp(true);
  }

  function closePopup() {
    setShowPopUp(false);
  }

  // Handle position updates from moving elements
  const updateObjectPosition = useCallback(
    (elementId: string, position: { top: number; left: number }) => {
      objectPositionsRef.current.set(elementId, position);
    },
    [],
  );

  // Handle object removal
  const removeObjectPosition = useCallback((elementId: string) => {
    objectPositionsRef.current.delete(elementId);
  }, []);

  return (
    <>
      <div className="question" ref={questionRef}>
        <p className="rotate1 l1 shadow-link">
          <span
            className="click-target"
            onClick={() => openPopUp(eAgoraObject)}
          >
            E
          </span>
        </p>
        <p className="l2 shadow-link">
          <span
            className="click-target"
            onClick={() => openPopUp(eAgoraObject)}
          >
            AGORA
          </span>
        </p>
        <p className="rotate2 l3 shadow-link">
          <span
            className="click-target"
            onClick={() => openPopUp(eAgoraObject)}
          >
            ?
          </span>
        </p>
      </div>

      {Array.from({ length: movingObjectCount }).map((_, index) => (
        <MovingElement
          key={index}
          elementId={`element-${index}`}
          movingObjects={movingObjects}
          onClick={(movingObject) => openPopUp(movingObject)}
          restrictedAreas={restrictedAreas}
          isFirst={movingObjectCount === 1}
          selectionCountsRef={selectionCountsRef}
          animationInterval={responsiveConfig.animationInterval}
          existingPositions={objectPositionsRef.current}
          onPositionUpdate={updateObjectPosition}
          onRemove={removeObjectPosition}
        />
      ))}

      <PopupModal
        isOpen={showPopUp}
        movingObject={activeMovingObject}
        onClose={closePopup}
      />

      <footer className="footer" ref={footerRef}>
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
