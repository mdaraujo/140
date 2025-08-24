import React, { useEffect, useMemo } from 'react';
import { Footer, QuestionHeader, Navbar } from '../components/layout';
import { MovingElement } from '../components/moving';
import { PopupModal } from '../components/ui';
import { MovingObject } from '../types/MovingObject';
import { MovingObjectsProvider, useMovingObjects } from '../contexts/MovingObjectsContext';
import { UIStateProvider, useUIState } from '../contexts/UIStateContext';
import { useMovingObjectsManager } from '../hooks/useMovingObjectsManager';
import '../App.css';

interface EventsPageProps {
  headerLines: [string, string, string];
  movingObjects: MovingObject[];
  randomizeFirst?: boolean;
}

function EventsContent({ headerLines, movingObjects, randomizeFirst = false }: EventsPageProps): JSX.Element | null {
  const {
    movingObjectCount,
    objectPositions,
    randomPickCounts,
    restrictedAreas,
    responsiveConfig,
    updateObjectPosition,
    removeObjectPosition,
  } = useMovingObjects();

  const { showPopup, activeMovingObject, openPopup, closePopup, openHeaderPopup } = useUIState();
  const { questionRef, footerRef, navbarRef } = useMovingObjectsManager(movingObjects);

  const themeClass = useMemo(() => (headerLines[1] === 'AGORA' ? 'theme-now' : 'theme-past'), [
    headerLines,
  ]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-now', 'theme-past');
    html.classList.add(themeClass);
    return () => {
      html.classList.remove('theme-now', 'theme-past');
    };
  }, [themeClass]);

  if (!responsiveConfig) return null;

  return (
    <div className={themeClass}>
      <Navbar ref={navbarRef} />
      <QuestionHeader ref={questionRef} onOpenPopUp={openHeaderPopup} lines={headerLines} />

      {Array.from({ length: movingObjectCount }).map((_, index) => (
        <MovingElement
          key={index}
          elementId={`element-${index}`}
          movingObjects={movingObjects}
          onClick={openPopup}
          restrictedAreas={restrictedAreas}
          isFirst={movingObjectCount === 1}
          randomizeFirst={randomizeFirst}
          selectionCountsRef={{ current: randomPickCounts }}
          animationInterval={responsiveConfig.animationInterval}
          existingPositions={objectPositions}
          onPositionUpdate={updateObjectPosition}
          onRemove={removeObjectPosition}
        />
      ))}

      <PopupModal
        isOpen={showPopup}
        movingObject={activeMovingObject}
        onClose={closePopup}
        showCtaButton={headerLines[1] === 'AGORA'}
      />
      <Footer ref={footerRef} />
    </div>
  );
}

const EventsPage: React.FC<EventsPageProps> = ({ headerLines, movingObjects, randomizeFirst = false }) => {
  const headerObject = movingObjects[0] || null;
  return (
    <MovingObjectsProvider initialMovingObjects={movingObjects}>
      <UIStateProvider headerObject={headerObject || movingObjects[0]!}>
        <EventsContent headerLines={headerLines} movingObjects={movingObjects} randomizeFirst={randomizeFirst} />
      </UIStateProvider>
    </MovingObjectsProvider>
  );
};

export default EventsPage;


