import React, { useEffect } from 'react';
import './QuemSomos.css';
import { Navbar, QuestionHeader, Footer } from '../components/layout';
import { aboutItems } from '../data/about';
import { CardGrid, ImageCard, TextBlock } from '../components/grid';

const QuemSomos: React.FC = () => {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-now', 'theme-past', 'theme-halloween', 'page-scroll');
    html.classList.add('theme-now');
    html.classList.add('page-scroll'); // enable whole-page scroll
    return () => {
      html.classList.remove('theme-now', 'theme-past', 'theme-halloween', 'page-scroll');
    };
  }, []);

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
                ariaLabel="Imagem"
              />
            ) : (
              <TextBlock key={`about-tx-${idx}`}>{it.text}</TextBlock>
            ),
          )}
        </CardGrid>
      </main>

      <Footer />
    </div>
  );
};

export default QuemSomos;
