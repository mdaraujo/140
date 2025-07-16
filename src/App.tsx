import React, { useState, useEffect, useRef } from 'react';

import './App.css';
import RandomLogo from './components/RandomLogo';
import { MovingObject } from './types/MovingObject';
import logoB1 from '/logo_b_1.png';
import logoB2 from '/logo_b_2.png';
import logoW1 from '/logo_w_1.png';
import logoW2 from '/logo_w_2.png';

import gumaJazzCartaz from './assets/GUMAJAZZ_cartaz.jpg';
import gumaJazzLogo from './assets/GUMAJAZZ_logo.png';
import ohmeSessionsJulho from './assets/ohme_sessions_julho.jpg';

const LOCATIONS = {
  cafeSociedade: "https://maps.app.goo.gl/6b4hyN2v7zgYSLDb7",
  fidelis: "https://maps.app.goo.gl/vGUHBfTgUpr96E7z7",
  gumaJazz: "https://maps.app.goo.gl/2SQxqcDrJwXRiRz98"
};

const TICKETS = {
  ohmeSessions: "https://www.bol.pt/Comprar/Bilhetes/158717-ohme_sessions-ponto_c/",
};

const FORMS = {
  fichaSocio: "https://forms.gle/dgnQgUeGjRHgjG2E7",
  gumaJazz: "https://forms.gle/9GpUC4mz8hfMp1S38",
};

const movingObjects: MovingObject[] = [
  // 8 / 16 = 50%
  { image: ohmeSessionsJulho, formLink: null, ticketsLink: TICKETS.ohmeSessions, location: null },
  { image: ohmeSessionsJulho, formLink: null, ticketsLink: TICKETS.ohmeSessions, location: null },
  { image: ohmeSessionsJulho, formLink: null, ticketsLink: TICKETS.ohmeSessions, location: null },
  { image: ohmeSessionsJulho, formLink: null, ticketsLink: TICKETS.ohmeSessions, location: null },
  { image: ohmeSessionsJulho, formLink: null, ticketsLink: TICKETS.ohmeSessions, location: null },
  { image: ohmeSessionsJulho, formLink: null, ticketsLink: TICKETS.ohmeSessions, location: null },
  { image: ohmeSessionsJulho, formLink: null, ticketsLink: TICKETS.ohmeSessions, location: null },
  { image: ohmeSessionsJulho, formLink: null, ticketsLink: TICKETS.ohmeSessions, location: null },
  // 4 / 16 = 25%
  { image: gumaJazzCartaz, formLink: null, ticketsLink: null, location: LOCATIONS.gumaJazz },
  { image: gumaJazzCartaz, formLink: null, ticketsLink: null, location: LOCATIONS.gumaJazz },
  { image: gumaJazzCartaz, formLink: null, ticketsLink: null, location: LOCATIONS.gumaJazz },
  { image: gumaJazzCartaz, formLink: null, ticketsLink: null, location: LOCATIONS.gumaJazz },
  // 4 / 16 = 25%
  { image: gumaJazzLogo, formLink: FORMS.gumaJazz, ticketsLink: null, location: null },
  { image: gumaJazzLogo, formLink: FORMS.gumaJazz, ticketsLink: null, location: null },
  { image: gumaJazzLogo, formLink: FORMS.gumaJazz, ticketsLink: null, location: null },
  { image: gumaJazzLogo, formLink: FORMS.gumaJazz, ticketsLink: null, location: null },
  // { image: logoB1, formLink: FORMS.fichaSocio, ticketsLink: null, location: null },
  // { image: logoB2, formLink: FORMS.fichaSocio, ticketsLink: null, location: null },
  // { image: logoW1, formLink: FORMS.fichaSocio, ticketsLink: null, location: null },
  // { image: logoW2, formLink: FORMS.fichaSocio, ticketsLink: null, location: null },
];
const MAX_MOVING_OBJECTS = 9; // Limit the number of movingObjects

const eAgoraObject = movingObjects[0];

const App: React.FC = () => {
  const [logoCount, setLogoCount] = useState<number>(1); // Start with 1 logo
  const [restrictedArea, setRestrictedArea] = useState<DOMRect | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [activeMovingObject, setActiveMovingObject] = useState<MovingObject | null>(null);

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

  function openPopUp(movingObject: MovingObject) {
    setActiveMovingObject(movingObject)
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
        <p
          className="l2 shadow-link"
          onClick={() => openPopUp(eAgoraObject)}
        >
          AGORA
        </p>
        <p
          className="rotate2 l3 shadow-link"
          onClick={() => openPopUp(eAgoraObject)}
        >
          ?
        </p>
      </div>

      {Array.from({ length: logoCount }).map((_, index) => (
        <RandomLogo
          key={index}
          movingObjects={movingObjects}
          onClick={(movingObject) => openPopUp(movingObject)}
          restrictedArea={restrictedArea}
        />
      ))}

      {showPopUp && (
        <div className="popup" onClick={closePopup}>
          {activeMovingObject?.ticketsLink ? (
            <div className="popup-content">
              <a href={activeMovingObject?.ticketsLink} target="_blank">
                <img src={activeMovingObject?.image} alt="Pop-up Poster" />
              </a>
              <a
                href={activeMovingObject?.ticketsLink}
                target="_blank"
                className="button shadow-link"
              >
                E agora? Bilhetes aqui&nbsp; <i className="fa fa-ticket" aria-hidden="true"></i>
              </a>
            </div>
          ) : (
            <div className="popup-content">
              <img src={activeMovingObject?.image} alt="Pop-up Poster" />
              <a
                href={activeMovingObject?.location || ""}
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
