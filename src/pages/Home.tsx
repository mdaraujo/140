import React from 'react';
import EventsPage from './EventsPage';
import { events } from '../data/events';
import { eventsToMovingObjects, fallbackSocioObjects, splitEvents } from '../utils/events';
import PumpkinOrange from '../assets/Pumpkin_Orange.png';
import PumpkinBlack from '../assets/Pumpkin_Black.png';

const Home: React.FC = () => {
  const { nowEvents } = splitEvents(events);
  const usingFallback = nowEvents.length === 0;
  const isHalloween = nowEvents.some((e) => /halloween/i.test(e.name));
  const eventObjects = usingFallback ? fallbackSocioObjects() : eventsToMovingObjects(nowEvents);
  const halloweenEvent = nowEvents.find((e) => /halloween/i.test(e.name));
  const halloweenObject = halloweenEvent ? eventsToMovingObjects([halloweenEvent])[0] : null;
  const PUMPKIN_COUNT = 6;
  const useBlackBg = true;
  const pumpkinBase = useBlackBg ? PumpkinOrange : PumpkinBlack;
  const pumpkinObjects =
    isHalloween && halloweenObject
      ? Array.from({ length: PUMPKIN_COUNT }, (_, i) => ({
          image: `${pumpkinBase}#${i + 1}`,
          modalImage: halloweenObject.image,
          formLink: null,
          ticketsLink: halloweenObject.ticketsLink ?? null,
          location: halloweenObject.location ?? null,
          description: halloweenObject.description,
          weight: 0.7,
        }))
      : [];
  const moving = usingFallback ? eventObjects : [...eventObjects, ...pumpkinObjects];

  return (
    <EventsPage
      headerLines={['E', 'AGORA', '?']}
      movingObjects={moving}
      randomizeFirst={usingFallback || nowEvents.length > 2}
    />
  );
};

export default Home;
