import React, { useEffect, useMemo } from 'react';
import './EventDetail.css';
import { Link, useParams } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout';
import { CardGrid, ImageCard, TextBlock } from '../components/grid';
import { events } from '../data/events';
import { ContentItem } from '../types/ContentItem';
import { splitEvents } from '../utils/events';

function formatDateTimeSingle(start: string): string {
  const s = new Date(start);
  const locale: Intl.LocalesArgument = 'pt-PT';
  const startStr = s.toLocaleString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  return startStr;
}

const EventDetail: React.FC = () => {
  const params = useParams();
  const event = useMemo(() => events.find((ev) => ev.id === params.id), [params.id]);
  const { pastEvents } = useMemo(() => splitEvents(events), []);
  const sortedPast = useMemo(
    () => [...pastEvents].sort((a, b) => new Date(b.endAt).getTime() - new Date(a.endAt).getTime()),
    [pastEvents],
  );
  const currentIndex = useMemo(
    () => sortedPast.findIndex((ev) => ev.id === params.id),
    [sortedPast, params.id],
  );
  const prevEventId = currentIndex > 0 ? sortedPast[currentIndex - 1].id : null;
  const nextEventId =
    currentIndex >= 0 && currentIndex < sortedPast.length - 1
      ? sortedPast[currentIndex + 1].id
      : null;

  const NavControls: React.FC = () => (
    <nav className="event-detail-nav" aria-label="Navegação de eventos">
      <Link to="/foi" className="event-btn" aria-label="Voltar à lista de eventos">
        Fechar
      </Link>
      <div className="event-nav-group">
        {prevEventId && (
          <Link to={`/evento/${prevEventId}`} className="event-btn" aria-label="Evento anterior">
            Anterior
          </Link>
        )}
        {nextEventId && (
          <Link to={`/evento/${nextEventId}`} className="event-btn" aria-label="Próximo evento">
            Seguinte
          </Link>
        )}
      </div>
    </nav>
  );
  const gridItems: ContentItem[] = useMemo(() => {
    if (!event) return [];
    if (event.items && event.items.length > 0) return event.items;

    const items: ContentItem[] = [{ kind: 'image', src: event.image, alt: event.name }];

    if (event.description) {
      items.push({ kind: 'text', title: event.name, text: event.description });
    }

    // Add combined Quando/Onde as a single text item in the grid
    const whenText = formatDateTimeSingle(event.startAt);
    const whenTitle = event.location ? 'Quando e Onde' : 'Quando?';
    items.push({ kind: 'text', title: whenTitle, text: whenText });

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
        <NavControls />
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
                ariaLabel="Imagem do evento"
              />
            ) : (
              <TextBlock key={`event-tx-${idx}`} title={it.title}>
                {event.location && it.title?.startsWith('Quando') ? (
                  <>
                    {it.text}
                    <br />
                    <a
                      href={event.location.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="socio-inline-link"
                    >
                      {event.location.name}
                    </a>
                  </>
                ) : (
                  it.text
                )}
              </TextBlock>
            ),
          )}
        </CardGrid>

        <NavControls />
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
