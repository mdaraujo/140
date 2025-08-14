import React, { useCallback, useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import MovingElement from '../components/MovingElement';
import PopupModal from '../components/PopupModal';
import QuestionHeader from '../components/QuestionHeader';
import { MovingObject } from '../types/MovingObject';
import { movingObjects, eAgoraObject } from '../data/movingObjects';
import { useObjectSpawning } from '../hooks/useObjectSpawning';
import { useResponsiveMovingObjects } from '../hooks/useResponsiveMovingObjects';
import { useTestingUtilities } from '../hooks/useTestingUtilities';
import { Position } from '../types/Position';

const Home: React.FC = () => {
  const [movingObjectCount, setMovingObjectCount] = useState<number>(1);
  const [restrictedAreas, setRestrictedAreas] = useState<DOMRect[]>([]);
  const questionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [activeMovingObject, setActiveMovingObject] =
    useState<MovingObject | null>(null);
  const selectionCountsRef = useRef<Map<string, number>>(new Map());
  const objectPositionsRef = useRef<Map<string, Position>>(new Map());

  const responsiveConfig = useResponsiveMovingObjects();
  useTestingUtilities(movingObjects, selectionCountsRef);
  useObjectSpawning({
    movingObjectCount,
    setMovingObjectCount,
    responsiveConfig,
  });

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

  const openPopUp = useCallback((movingObject: MovingObject) => {
    setActiveMovingObject(movingObject);
    setShowPopUp(true);
  }, []);

  const openHeaderPopUp = useCallback(() => {
    openPopUp(eAgoraObject);
  }, [openPopUp]);

  const closePopup = useCallback(() => setShowPopUp(false), []);

  const updateObjectPosition = useCallback(
    (elementId: string, position: Position) => {
      objectPositionsRef.current.set(elementId, position);
    },
    [],
  );

  const removeObjectPosition = useCallback((elementId: string) => {
    objectPositionsRef.current.delete(elementId);
  }, []);

  return (
    <>
      <QuestionHeader ref={questionRef} onOpenPopUp={openHeaderPopUp} />

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

      <Footer ref={footerRef} />
    </>
  );
};

export default Home;
