import React, { useCallback, useEffect, useMemo } from 'react';
import { Footer, QuestionHeader, Navbar } from '../components/layout';
import { MovingElement } from '../components/moving';
import { PopupModal } from '../components/ui';
import { MovingObject } from '../types/MovingObject';
import { MovingObjectsProvider, useMovingObjects } from '../contexts/MovingObjectsContext';
import { UIStateProvider, useUIState } from '../contexts/UIStateContext';
import { useMovingObjectsManager } from '../hooks/useMovingObjectsManager';
import { events as allEvents } from '../data/events';
import { splitEvents, getHeaderMovingObject } from '../utils/events';
import '../App.css';

interface EventsPageProps {
  headerLines: [string, string, string];
  movingObjects: MovingObject[];
  randomizeFirst?: boolean;
  enforceUniqueAssignments?: boolean;
}

/*function formatDayShortMonthPt(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const day = date.toLocaleString('pt-PT', { day: '2-digit' });
  const monthShort = date.toLocaleString('pt-PT', { month: 'short' });
  const month = monthShort.replace('', '');
  return `${day} ${month}`;
}*/

function EventsContent({
  headerLines,
  movingObjects,
  randomizeFirst = false,
}: EventsPageProps): JSX.Element | null {
  const {
    movingObjectCount,
    objectPositions,
    restrictedAreas,
    responsiveConfig,
    updateObjectPosition,
    removeObjectPosition,
  } = useMovingObjects();

  const { showPopup, activeMovingObject, openPopup, closePopup, openHeaderPopup } = useUIState();
  const { questionRef, footerRef, navbarRef } = useMovingObjectsManager(movingObjects);

  const themeClass = useMemo(
    () => (headerLines[1] === 'AGORA' ? 'theme-now' : 'theme-past'),
    [headerLines],
  );
  const isHalloween = useMemo(() => {
    const { nowEvents } = splitEvents(allEvents);
    return nowEvents.some((e) => /halloween/i.test(e.name));
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-now', 'theme-past', 'theme-halloween');
    html.classList.add(themeClass);
    if (themeClass === 'theme-now' && isHalloween) html.classList.add('theme-halloween');
    return () => {
      html.classList.remove('theme-now', 'theme-past', 'theme-halloween');
    };
  }, [themeClass, isHalloween]);

  // Build fun answer text
  const answerText = (() => {
    const { nowEvents, pastEvents } = splitEvents(allEvents);
    if (headerLines[1] === 'AGORA') {
      if (nowEvents.length === 0) {
        const OPTIONS = ['Torna-te sócio!', 'Vê o que já foi!'];
        return OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
      }
      const next = [...nowEvents].sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      )[0];
      // const when = formatDayShortMonthPt(next.startAt);
      return `${next.name}!`;
    }
    const JOY_WORDS = [
      'muita cultura',
      'muito movimento',
      'muitas sinergias',
      'muita autenticidade',
      'muitas inovações',
      'muita improvisação',
      'muitas colaborações',
      'muitas fusões',
      'muitas partilhas',
      'muita liberdade',
      'muitas utopias',
    ];
    const word = JOY_WORDS[Math.floor(Math.random() * JOY_WORDS.length)];
    return `Foram ${pastEvents.length} eventos e ${word}!`;
  })();

  const handleAnswerClick = useCallback(() => {
    // On Agora page: if no events and answer suggests past, navigate to /foi
    if (headerLines[1] === 'AGORA') {
      const { nowEvents } = splitEvents(allEvents);
      const base = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || '/';
      if (nowEvents.length === 0 && answerText.toLowerCase().includes('já foi')) {
        window.location.assign(`${base}foi`);
        return;
      }
      if (answerText.toLowerCase().includes('torna-te sócio')) {
        window.location.assign(`${base}socio`);
        return;
      }
    }
    openHeaderPopup();
  }, [headerLines, openHeaderPopup, answerText]);

  if (!responsiveConfig) return null;

  return (
    <div className={themeClass}>
      <Navbar ref={navbarRef} />
      <QuestionHeader
        ref={questionRef}
        onOpenPopUp={openHeaderPopup}
        lines={headerLines}
        answer={answerText}
        onAnswerClick={handleAnswerClick}
      />

      {Array.from({ length: movingObjectCount }).map((_, index) => (
        <MovingElement
          key={index}
          elementId={`element-${index}`}
          movingObjects={movingObjects}
          onClick={openPopup}
          restrictedAreas={restrictedAreas}
          isFirst={movingObjectCount === 1}
          randomizeFirst={randomizeFirst}
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

const EventsPage: React.FC<EventsPageProps> = ({
  headerLines,
  movingObjects,
  randomizeFirst = false,
  enforceUniqueAssignments = true,
}) => {
  const headerMovingObject = useMemo(
    () => (headerLines[1] === 'AGORA' ? getHeaderMovingObject(allEvents) : null),
    [headerLines],
  );
  return (
    <MovingObjectsProvider
      initialMovingObjects={movingObjects}
      enforceUniqueAssignments={enforceUniqueAssignments}
    >
      <UIStateProvider movingObjects={movingObjects} headerMovingObject={headerMovingObject}>
        <EventsContent
          headerLines={headerLines}
          movingObjects={movingObjects}
          randomizeFirst={randomizeFirst}
          enforceUniqueAssignments={enforceUniqueAssignments}
        />
      </UIStateProvider>
    </MovingObjectsProvider>
  );
};

export default EventsPage;
