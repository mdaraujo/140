import React, { useCallback, useEffect, useState } from 'react';
import './QuemSomos.css';
import { Navbar, QuestionHeader, Footer } from '../components/layout';
import { PopupModal } from '../components/ui';
import { MovingObject } from '../types/MovingObject';
import { aboutItems } from '../data/about';
import { CardGrid, ImageCard, TextBlock } from '../components/grid';

const QuemSomos: React.FC = () => {
  const [active, setActive] = useState<MovingObject | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-now', 'theme-past', 'theme-halloween', 'page-scroll');
    html.classList.add('theme-now');
    html.classList.add('page-scroll'); // enable whole-page scroll
    return () => {
      html.classList.remove('theme-now', 'theme-past', 'theme-halloween', 'page-scroll');
    };
  }, []);

  const handleOpen = useCallback((item: MovingObject) => {
    setActive(item);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <div className="about-page">
      <Navbar />
      <QuestionHeader lines={['E', 'QUEM SOMOS', '?']} onOpenPopUp={() => {}} />

      <main className="about-content" role="main" aria-labelledby="about-title">
        <h1 id="about-title" className="sr-only">
          E quem somos?
        </h1>

        <CardGrid mobileColumns={1} desktopColumns={3} ariaLabel="Conteúdos da Associação 140">
          {aboutItems.map((it, idx) =>
            it.kind === 'image' ? (
              <ImageCard
                key={`about-img-${idx}`}
                src={it.src}
                alt={it.alt || 'Associação 140'}
                onClick={() =>
                  handleOpen({
                    image: it.src,
                    formLink: null,
                    ticketsLink: null,
                    location: null,
                    weight: 1,
                  })
                }
                ariaLabel="Ampliar imagem"
              />
            ) : (
              <TextBlock key={`about-tx-${idx}`}>{it.text}</TextBlock>
            ),
          )}
        </CardGrid>
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
