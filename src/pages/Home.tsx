import React from 'react';
import EventsPage from './EventsPage';
import { events } from '../data/events';
import { eventsToMovingObjects, fallbackSocioObjects, splitEvents } from '../utils/events';

const Home: React.FC = () => {
  const { nowEvents } = splitEvents(events);
  const usingFallback = nowEvents.length === 0;
  const moving = usingFallback ? fallbackSocioObjects() : eventsToMovingObjects(nowEvents);

  return (
    <EventsPage
      headerLines={['E', 'AGORA', '?']}
      movingObjects={moving}
      randomizeFirst={usingFallback || nowEvents.length > 2}
    />
  );
};

export default Home;
