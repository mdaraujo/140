import React, { useState, useEffect, useRef } from 'react';

import './App.css';
import RandomLogo from './components/RandomLogo';
import { MovingObject } from './types/MovingObject';
// import logoB1 from '/logo_b_1.png';
// import logoB2 from '/logo_b_2.png';
// import logoW1 from '/logo_w_1.png';
// import logoW2 from '/logo_w_2.png';

import gumaJazzCartaz from './assets/GUMAJAZZ_cartaz.jpg';
import gumaJazzLogo from './assets/GUMAJAZZ_logo.png';
import gumaJazzGig15 from './assets/GUMAJAZZ_gig_15.jpeg';
import gumaJazzGig17 from './assets/GUMAJAZZ_gig_17.jpeg';
import gumaJazzGig18 from './assets/GUMAJAZZ_gig_18.jpeg';
import gumaJazzGig21 from './assets/GUMAJAZZ_gig_21.jpeg';
import gumaJazzGig22 from './assets/GUMAJAZZ_gig_22.jpeg';

const LOCATIONS = {
  cafeSociedade: 'https://maps.app.goo.gl/6b4hyN2v7zgYSLDb7',
  fidelis: 'https://maps.app.goo.gl/vGUHBfTgUpr96E7z7',
  gumaJazz: 'https://maps.app.goo.gl/2SQxqcDrJwXRiRz98',
};

const FORMS = {
  fichaSocio: 'https://forms.gle/dgnQgUeGjRHgjG2E7',
  gumaJazz: 'https://forms.gle/9GpUC4mz8hfMp1S38',
};

const DESCRIPTIONS = {
  cartaz:
    'A Associação 140 convida o público para mais uma edição do GumaJazz, um evento que celebra o jazz, a improvisação, o artesanato e a criação comunitária no coração do verão.\nO festival acontece no dia 17 de agosto de 2025, a partir das 15h.',
  workshop15h:
    'O Clara Lacerda Trio dinamiza um workshop aberto a todas as pessoas a partir dos 6 anos, músicos e não músicos. Uma proposta educativa e sensorial que celebra a improvisação como linguagem inclusiva.',
  gentrifugacao17h:
    'Performance-instalação site-specific de Joana Raquel e Diana Gil, que resgata a memória dos lavadouros como espaços de trabalho, resistência e poesia. Através da música, palavra e intervenção visual.',
  miguelMeirinhos18h:
    'Pianista e compositor natural do Porto apresenta um solo centrado na escuta, no risco e na liberdade. O seu piano constrói narrativas em tempo real, com atenção ao instante, ao som e ao silêncio.',
  claraLacerdaTrio21h:
    'Reencontro do trio que se formou em 2017 e regressa ao local onde tudo começou: Clara Lacerda (piano), Xavier Nunes (contrabaixo) e Eduardo Dias (bateria). Repertório de composições originais a Thelonious Monk e Duke Ellington.',
  barananu22h:
    'Música para dançar, rir e brincar. Com improviso, groove e espírito lúdico, Barananu junta seis músicos de diferentes áreas num espetáculo vibrante e imprevisível.',
};

const movingObjects: MovingObject[] = [
  // Cartaz - minimal since it appears first (1 / 17 ≈ 5.9%)
  {
    image: gumaJazzCartaz,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.cartaz,
  },
  // Logo - minimal probability (1 / 17 ≈ 5.9%)
  {
    image: gumaJazzLogo,
    formLink: FORMS.gumaJazz,
    ticketsLink: null,
    location: null,
  },
  // Artist gig images - maximum focus (3 each / 17 ≈ 17.6% each, 88.2% total)
  {
    image: gumaJazzGig15,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.workshop15h,
  },
  {
    image: gumaJazzGig15,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.workshop15h,
  },
  {
    image: gumaJazzGig15,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.workshop15h,
  },
  {
    image: gumaJazzGig17,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.gentrifugacao17h,
  },
  {
    image: gumaJazzGig17,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.gentrifugacao17h,
  },
  {
    image: gumaJazzGig17,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.gentrifugacao17h,
  },
  {
    image: gumaJazzGig18,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.miguelMeirinhos18h,
  },
  {
    image: gumaJazzGig18,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.miguelMeirinhos18h,
  },
  {
    image: gumaJazzGig18,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.miguelMeirinhos18h,
  },
  {
    image: gumaJazzGig21,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.claraLacerdaTrio21h,
  },
  {
    image: gumaJazzGig21,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.claraLacerdaTrio21h,
  },
  {
    image: gumaJazzGig21,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.claraLacerdaTrio21h,
  },
  {
    image: gumaJazzGig22,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.barananu22h,
  },
  {
    image: gumaJazzGig22,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.barananu22h,
  },
  {
    image: gumaJazzGig22,
    formLink: null,
    ticketsLink: null,
    location: LOCATIONS.gumaJazz,
    description: DESCRIPTIONS.barananu22h,
  },
  // { image: logoB1, formLink: FORMS.fichaSocio, ticketsLink: null, location: null },
  // { image: logoB2, formLink: FORMS.fichaSocio, ticketsLink: null, location: null },
  // { image: logoW1, formLink: FORMS.fichaSocio, ticketsLink: null, location: null },
  // { image: logoW2, formLink: FORMS.fichaSocio, ticketsLink: null, location: null },
];
const MAX_MOVING_OBJECTS = 9; // Limit the number of movingObjects

const eAgoraObject = movingObjects[0];

const App: React.FC = () => {
  const [movingObjectCount, setMovingObjectCount] = useState<number>(1); // Start with 1 moving object
  const [restrictedArea, setRestrictedArea] = useState<DOMRect | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [activeMovingObject, setActiveMovingObject] =
    useState<MovingObject | null>(null);

  // Add new movingObjects at random intervals
  useEffect(() => {
    if (movingObjectCount <= MAX_MOVING_OBJECTS) {
      // Make the first moving objects appear faster, then slow down
      let minInterval, maxInterval;
      if (movingObjectCount < 2) {
        minInterval = 600; // 0.6s
        maxInterval = 1200; // 1.2s
      } else if (movingObjectCount < 4) {
        minInterval = 1200; // 1.2s
        maxInterval = 2000; // 2s
      } else {
        minInterval = 2000; // 2s
        maxInterval = 3500; // 3.5s
      }
      const interval = setInterval(
        () => {
          setMovingObjectCount((count) =>
            Math.min(count + 1, MAX_MOVING_OBJECTS),
          );
        },
        Math.random() * (maxInterval - minInterval) + minInterval,
      );
      return () => clearInterval(interval);
    }
  }, [movingObjectCount]);

  // Get the bounding box of the question paragraphs
  useEffect(() => {
    if (questionRef.current) {
      setRestrictedArea(questionRef.current.getBoundingClientRect());
    }
  }, []);

  function openPopUp(movingObject: MovingObject) {
    setActiveMovingObject(movingObject);
    setShowPopUp(true);
  }

  function closePopup() {
    setShowPopUp(false);
  }

  return (
    <>
      <div className="question" ref={questionRef}>
        <p
          className="rotate1 l1 shadow-link"
          onClick={() => openPopUp(eAgoraObject)}
        >
          E
        </p>
        <p className="l2 shadow-link" onClick={() => openPopUp(eAgoraObject)}>
          AGORA
        </p>
        <p
          className="rotate2 l3 shadow-link"
          onClick={() => openPopUp(eAgoraObject)}
        >
          ?
        </p>
      </div>

      {Array.from({ length: movingObjectCount }).map((_, index) => (
        <RandomLogo
          key={index}
          movingObjects={movingObjects}
          onClick={(movingObject) => openPopUp(movingObject)}
          restrictedArea={restrictedArea}
          isFirst={movingObjectCount === 1}
        />
      ))}

      {showPopUp && (
        <div className="popup" onClick={closePopup}>
          {activeMovingObject?.ticketsLink ? (
            <div className="popup-content">
              <a href={activeMovingObject?.ticketsLink} target="_blank">
                <img src={activeMovingObject?.image} alt="Pop-up Poster" />
              </a>
              {activeMovingObject?.description && (
                <p className="artist-description">
                  {activeMovingObject.description}
                </p>
              )}
              <a
                href={activeMovingObject?.ticketsLink}
                target="_blank"
                className="button shadow-link"
              >
                E agora? Bilhetes aqui&nbsp;{' '}
                <i className="fa fa-ticket" aria-hidden="true"></i>
              </a>
            </div>
          ) : (
            <div className="popup-content">
              <img src={activeMovingObject?.image} alt="Pop-up Poster" />
              {activeMovingObject?.description && (
                <p className="artist-description">
                  {activeMovingObject.description}
                </p>
              )}
              <a
                href={activeMovingObject?.location || ''}
                target="_blank"
                className="button shadow-link"
              >
                Entrada Livre&nbsp;{' '}
                <i className="fa fa-map-marker" aria-hidden="true"></i>
              </a>
            </div>
          )}
        </div>
      )}

      <footer className="footer">
        <p>
          <strong>Associação 140</strong>
        </p>
        <p>Movimento Artístico e Sociocultural</p>
        <p>
          <a href={FORMS.fichaSocio} target="_blank">
            <strong>Torna-te sócio!</strong>
          </a>
        </p>
        <p>
          <i className="fa fa-instagram" aria-hidden="true"></i>
          &nbsp;
          <a
            href="https://www.instagram.com/cento.quarenta/"
            target="_blank"
            rel="noopener noreferrer"
          >
            cento.quarenta
          </a>
        </p>
        <p>
          <i className="fa fa-envelope-o" aria-hidden="true"></i>
          &nbsp;
          <a href="mailto:geral@140.pt">geral@140.pt</a>
        </p>
        <p>
          <i className="fa fa-copyright" aria-hidden="true"></i>
          &nbsp;2024-2025 Penafiel
        </p>
      </footer>
    </>
  );
};

export default App;
