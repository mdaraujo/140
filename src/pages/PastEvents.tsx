import { useEffect } from 'react';
import './PastEvents.css';
import { Navbar, QuestionHeader, Footer } from '../components/layout';
import { CardGrid, ImageCard } from '../components/grid';
import { events } from '../data/events';
import { splitEvents } from '../utils/events';

function PastEvents(): JSX.Element {
  const { pastEvents } = splitEvents(events);
  const base = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || '/';
  const sorted = [...pastEvents].sort(
    (a, b) => new Date(b.endAt).getTime() - new Date(a.endAt).getTime(),
  );

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-now', 'theme-halloween', 'page-scroll');
    html.classList.add('theme-past');
    html.classList.add('page-scroll'); // enable whole-page scroll
    return () => {
      html.classList.remove('theme-past', 'page-scroll');
    };
  }, []);

  return (
    <div className="past-page">
      <Navbar />
      <QuestionHeader lines={['E', 'O QUE FOI', '?']} onOpenPopUp={() => {}} />
      <main className="past-content" role="main" aria-labelledby="past-title">
        <h1 id="past-title" className="sr-only">
          E o que foi?
        </h1>
        <CardGrid mobileColumns={2} desktopColumns={3} ariaLabel="Eventos anteriores">
          {sorted.map((e) => (
            <ImageCard
              key={e.id}
              src={e.image}
              alt={e.name}
              to={`${base}evento/${e.id}`}
              ariaLabel={`Abrir página do evento ${e.name}`}
            />
          ))}
        </CardGrid>
      </main>
      <Footer />
    </div>
  );
}

export default PastEvents;
