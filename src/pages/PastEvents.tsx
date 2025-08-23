import React from 'react';
import EventsPage from './EventsPage';
import { events } from '../data/events';
import { eventsToMovingObjects, splitEvents } from '../utils/events';

const PastEvents: React.FC = () => {
  const { pastEvents } = splitEvents(events);
  const moving = eventsToMovingObjects(pastEvents);

  return <EventsPage headerLines={['E', 'O QUE FOI', '?']} movingObjects={moving} />;
};

export default PastEvents;


