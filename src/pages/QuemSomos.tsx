import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './QuemSomos.css';
import { Navbar, QuestionHeader, Footer } from '../components/layout';
import { PopupModal } from '../components/ui';
import { MovingObject } from '../types/MovingObject';
import { aboutItems } from '../data/about';

const HEADER_LINES: [string, string, string] = ['E', 'QUEM SOMOS', '?'];

function pickHeaderAnswer(): string {
  const OPTIONS = ['Associação 140', 'Movimento artístico e sociocultural'];
  return OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
}

const QuemSomos: React.FC = () => {
  const [active, setActive] = useState<MovingObject | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const answer = useMemo(() => pickHeaderAnswer(), []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-now', 'theme-past', 'theme-halloween');
    html.classList.add('theme-now');
    return () => {
      html.classList.remove('theme-now', 'theme-past', 'theme-halloween');
    };
  }, []);

  const handleOpen = useCallback((item: MovingObject) => {
    setActive(item);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleHeaderOpen = useCallback(() => {
    if (!aboutItems.length) return;
    const item = aboutItems[Math.floor(Math.random() * aboutItems.length)];
    handleOpen(item);
  }, [handleOpen]);

  return (
    <div className="about-page">
      <Navbar />
      <QuestionHeader lines={HEADER_LINES} answer={answer} onOpenPopUp={handleHeaderOpen} />

      <main className="about-content" role="main" aria-labelledby="about-title">
        <h1 id="about-title" className="sr-only">
          E quem somos?
        </h1>

        <section className="about-grid" aria-label="Imagens e textos sobre a Associação 140">
          {aboutItems.map((item, idx) => (
            <figure className="about-card shadow-link" key={`about-${idx}`}>
              <button
                type="button"
                className="about-card-button"
                aria-label="Abrir detalhes"
                onClick={() => handleOpen(item)}
              >
                <img src={item.image} alt="Associação 140" className="about-card-image" />
              </button>
            </figure>
          ))}
        </section>
      </main>

      <PopupModal
        isOpen={isOpen}
        movingObject={active}
        onClose={handleClose}
        showCtaButton={false}
      />
      <Footer />
    </div>
  );
};

export default QuemSomos;
