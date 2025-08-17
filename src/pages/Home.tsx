import React from 'react';
import { Footer, QuestionHeader } from '../components/layout';
import { MovingElement } from '../components/moving';
import { PopupModal } from '../components/ui';
import { movingObjects } from '../data/movingObjects';
import { useMovingObjects } from '../contexts/MovingObjectsContext';
import { useUIState } from '../contexts/UIStateContext';
import { useMovingObjectsManager } from '../hooks/useMovingObjectsManager';

const Home: React.FC = () => {
  // Get state and actions from contexts
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

  // Consolidated business logic hook
  const { questionRef, footerRef } = useMovingObjectsManager();

  // Early return if responsive config not ready
  if (!responsiveConfig) return null;

  return (
    <>
      <QuestionHeader ref={questionRef} onOpenPopUp={openHeaderPopup} />

      {Array.from({ length: movingObjectCount }).map((_, index) => (
        <MovingElement
          key={index}
          elementId={`element-${index}`}
          movingObjects={movingObjects}
          onClick={openPopup}
          restrictedAreas={restrictedAreas}
          isFirst={movingObjectCount === 1}
          selectionCountsRef={{ current: randomPickCounts }}
          animationInterval={responsiveConfig.animationInterval}
          existingPositions={objectPositions}
          onPositionUpdate={updateObjectPosition}
          onRemove={removeObjectPosition}
        />
      ))}

      <PopupModal isOpen={showPopup} movingObject={activeMovingObject} onClose={closePopup} />

      <Footer ref={footerRef} />
    </>
  );
};

export default Home;
