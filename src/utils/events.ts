import { EventItem } from '../types/Event';
import { MovingObject } from '../types/MovingObject';
import { FORMS } from '../data/constants';

export function isNow(event: EventItem, now: Date = new Date()): boolean {
  const end = new Date(event.endAt).getTime();
  return end >= now.getTime();
}

export function splitEvents(
  events: EventItem[],
  now: Date = new Date(),
): {
  nowEvents: EventItem[];
  pastEvents: EventItem[];
} {
  const nowEvents = events.filter((e) => isNow(e, now));
  const pastEvents = events.filter((e) => !isNow(e, now));
  return { nowEvents, pastEvents };
}

export function eventsToMovingObjects(events: EventItem[]): MovingObject[] {
  return events.map((e) => ({
    image: e.image,
    description: e.description,
    formLink: e.formLink ?? null,
    ticketsLink: e.ticketsLink ?? null,
    location: e.location ?? null,
    weight: e.weight ?? 1,
  }));
}

export function fallbackSocioObjects(): MovingObject[] {
  const base: string =
    (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || '/';
  const src = (name: string) => `${base}${name}`;
  return [
    {
      image: src('logo_b_1.png'),
      formLink: FORMS.fichaSocio,
      ticketsLink: null,
      location: null,
      weight: 1,
    },
    {
      image: src('logo_b_2.png'),
      formLink: FORMS.fichaSocio,
      ticketsLink: null,
      location: null,
      weight: 1,
    },
    {
      image: src('logo_w_1.png'),
      formLink: FORMS.fichaSocio,
      ticketsLink: null,
      location: null,
      weight: 1,
    },
    {
      image: src('logo_w_2.png'),
      formLink: FORMS.fichaSocio,
      ticketsLink: null,
      location: null,
      weight: 1,
    },
    /*{
      image: src('logo_r1_1.png'),
      formLink: FORMS.fichaSocio,
      ticketsLink: null,
      location: null,
      weight: 1,
    },
    {
      image: src('logo_r1_2.png'),
      formLink: FORMS.fichaSocio,
      ticketsLink: null,
      location: null,
      weight: 1,
    },
    {
      image: src('logo_r2_1.png'),
      formLink: FORMS.fichaSocio,
      ticketsLink: null,
      location: null,
      weight: 1,
    },
    {
      image: src('logo_r2_2.png'),
      formLink: FORMS.fichaSocio,
      ticketsLink: null,
      location: null,
      weight: 1,
    },*/
  ];
}
