import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import RandomLogo from './components/RandomLogo';
import logoB1 from '/logo_b_1.png';
import logoB2 from '/logo_b_2.png';
import logoW1 from '/logo_w_1.png';
import logoW2 from '/logo_w_2.png';
import beernissageMarch from './assets/Beernissage_March_8.jpeg';
import beernissageApril from './assets/Beernissage_April_12.jpeg';
import { MovingObject } from './types/MovingObject';

const formLink = 'https://forms.gle/dgnQgUeGjRHgjG2E7';

const movingObjects: MovingObject[] = [
  // 8 / 14 = 57%
  { image: beernissageApril, formLink: null, ticketsLink: null },
  { image: beernissageApril, formLink: null, ticketsLink: null },
  { image: beernissageApril, formLink: null, ticketsLink: null },
  { image: beernissageApril, formLink: null, ticketsLink: null },
  { image: beernissageApril, formLink: null, ticketsLink: null },
  { image: beernissageApril, formLink: null, ticketsLink: null },
  { image: beernissageApril, formLink: null, ticketsLink: null },
  { image: beernissageApril, formLink: null, ticketsLink: null },
  // 2 / 14 = 14%
  { image: beernissageMarch, formLink: null, ticketsLink: null },
  { image: beernissageMarch, formLink: null, ticketsLink: null },
  // 4 / 14 = 29%
  { image: logoB1, formLink: formLink, ticketsLink: null },
  { image: logoB2, formLink: formLink, ticketsLink: null },
  { image: logoW1, formLink: formLink, ticketsLink: null },
  { image: logoW2, formLink: formLink, ticketsLink: null },
];
const MAX_MOVING_OBJECTS = 9; // Limit the number of movingObjects

const eAgoraPoster = beernissageApril;
const eAgoraTickets = null;

const App: React.FC = () => {
  const [logoCount, setLogoCount] = useState<number>(1); // Start with 1 logo
  const [restrictedArea, setRestrictedArea] = useState<DOMRect | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [activePoster, setActivePoster] = useState<string>('');
  const [activeTicketsLink, setActiveTicketsLink] = useState<string | null>('');

  // Add new movingObjects at random intervals
  useEffect(() => {
    if (logoCount <= MAX_MOVING_OBJECTS) {
      const interval = setInterval(
        () => {
          // Ensure we don't exceed the max
          setLogoCount((count) => Math.min(count + 1, MAX_MOVING_OBJECTS));
        },
        Math.random() * 3000 + 2000,
      ); // Random interval between 2s and 5s

      return () => clearInterval(interval);
    }
  }, [logoCount]);

  // Get the bounding box of the question paragraphs
  useEffect(() => {
    if (questionRef.current) {
      setRestrictedArea(questionRef.current.getBoundingClientRect());
    }
  }, []);

  function openPopUp(image: string, ticketsLink: string | null) {
    setActivePoster(image);
    setActiveTicketsLink(ticketsLink);
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
          onClick={() => openPopUp(eAgoraPoster, eAgoraTickets)}
        >
          E
        </p>
        <p
          className="l2 shadow-link"
          onClick={() => openPopUp(eAgoraPoster, eAgoraTickets)}
        >
          AGORA
        </p>
        <p
          className="rotate2 l3 shadow-link"
          onClick={() => openPopUp(eAgoraPoster, eAgoraTickets)}
        >
          ?
        </p>
      </div>

      {Array.from({ length: logoCount }).map((_, index) => (
        <RandomLogo
          key={index}
          movingObjects={movingObjects}
          onClick={(image, ticketsLink) => openPopUp(image, ticketsLink)}
          restrictedArea={restrictedArea}
        />
      ))}

      {showPopUp && (
        <div className="popup" onClick={closePopup}>
          {activeTicketsLink ? (
            <div className="popup-content">
              <a href={activeTicketsLink} target="_blank">
                <img src={activePoster} alt="Pop-up Poster" />
              </a>
              <a
                href={activeTicketsLink}
                target="_blank"
                className="button shadow-link"
              >
                E agora? Bilhetes aqui&nbsp; <i className="fa fa-ticket" aria-hidden="true"></i>
              </a>
            </div>
          ) : (
            <div className="popup-content">
              <img src={activePoster} alt="Pop-up Poster" />
              <a
                href={"https://maps.app.goo.gl/vGUHBfTgUpr96E7z7"}
                target="_blank"
                className="button shadow-link"
              >
                Entrada Livre&nbsp; <i className="fa fa-map-marker" aria-hidden="true"></i>
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
          <a href={formLink} target="_blank">
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
          &nbsp;2024 Penafiel
        </p>
      </footer>
    </>
  );
};

export default App;
