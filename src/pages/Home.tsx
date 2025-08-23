import React from 'react';
import EventsPage from './EventsPage';
import { events } from '../data/events';
import { eventsToMovingObjects, fallbackSocioObjects, splitEvents } from '../utils/events';

const Home: React.FC = () => {
  const { nowEvents } = splitEvents(events);
  const moving = nowEvents.length ? eventsToMovingObjects(nowEvents) : fallbackSocioObjects();

  return <EventsPage headerLines={['E', 'AGORA', '?']} movingObjects={moving} />;
};

export default Home;
