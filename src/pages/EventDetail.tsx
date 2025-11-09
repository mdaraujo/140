import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './EventDetail.css';
import { useParams } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout';
import { CardGrid, ImageCard, TextBlock } from '../components/grid';
import { events } from '../data/events';
import { PopupModal } from '../components/ui';
import { MovingObject } from '../types/MovingObject';
import { ContentItem } from '../types/ContentItem';

function formatDateTimeRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const locale: Intl.LocalesArgument = 'pt-PT';
  const startStr = s.toLocaleString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  const endStr = e.toLocaleString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${startStr} – ${endStr}`;
}

const EventDetail: React.FC = () => {
  const params = useParams();
  const [modalObj, setModalObj] = useState<MovingObject | null>(null);

  const event = useMemo(() => events.find((ev) => ev.id === params.id), [params.id]);

  const gridItems: ContentItem[] = useMemo(() => {
    if (!event) return [];
    if (event.items && event.items.length > 0) return event.items;
    const items: ContentItem[] = [{ kind: 'image', src: event.image, alt: event.name }];
    if (event.description) items.push({ kind: 'text', title: event.name, text: event.description });
    return items;
  }, [event]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-now', 'theme-halloween', 'page-scroll');
    html.classList.add('theme-past');
    html.classList.add('page-scroll'); // enable whole-page scroll
    return () => {
      html.classList.remove('theme-past', 'page-scroll');
    };
  }, []);

  const handleOpenModal = useCallback(
    (src: string) => {
      setModalObj({
        image: src,
        formLink: null,
        ticketsLink: null,
        location: null,
        weight: 1,
      });
    },
    [setModalObj],
  );

  const handleCloseModal = useCallback(() => setModalObj(null), []);

  if (!event) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main
          style={{
            width: '100%',
            maxWidth: '1024px',
            margin: '0 auto',
            padding: '1rem',
            paddingBottom: '88px',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            flex: 1,
            minHeight: 0,
          }}
        >
          <h1>Evento não encontrado</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <Navbar />
      <main className="event-detail-content" role="main" aria-labelledby="event-title">
        <h1 id="event-title" className="sr-only">
          {event.name}
        </h1>
        <CardGrid mobileColumns={1} desktopColumns={3} ariaLabel="Conteúdos do evento">
          {gridItems.map((it, idx) =>
            it.kind === 'image' ? (
              <ImageCard
                key={`event-img-${idx}`}
                src={it.src}
                alt={it.alt || event.name}
                onClick={() => handleOpenModal(it.src)}
                ariaLabel="Ampliar imagem do evento"
              />
            ) : (
              <TextBlock key={`event-tx-${idx}`} title={it.title}>
                {it.text}
              </TextBlock>
            ),
          )}
        </CardGrid>

        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          <TextBlock title="Quando">
            <p>{formatDateTimeRange(event.startAt, event.endAt)}</p>
          </TextBlock>
          {event.location ? (
            <TextBlock title="Localização">
              <p>
                <a
                  href={event.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="socio-inline-link"
                >
                  Ver no mapa
                </a>
              </p>
            </TextBlock>
          ) : null}
        </div>
      </main>
      <PopupModal
        isOpen={!!modalObj}
        movingObject={modalObj}
        onClose={handleCloseModal}
        showCtaButton={false}
      />
      <Footer />
    </div>
  );
};

export default EventDetail;
