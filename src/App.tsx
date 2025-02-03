import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import RandomLogo from './components/RandomLogo';
import logoB1 from '/logo_b_1.png';
import logoB2 from '/logo_b_2.png';
import vozesRasgamPoster from './assets/vozes_que_rasgam.jpeg';
import beernissagePoster from './assets/beernissage_fev_08.jpeg';
import { MovingObject } from './types/MovingObject';

const formLink = 'https://forms.gle/dgnQgUeGjRHgjG2E7';
const ticketsLink =
  'https://www.bol.pt/Comprar/Bilhetes/148672-vozes_que_rasgam_kali_alice_em_nenhum_lugar_moria_e_bruma-ponto_c_cultura_e_criatividade/';

const movingObjects: MovingObject[] = [
  { image: vozesRasgamPoster, link: null },
  { image: vozesRasgamPoster, link: null },
  { image: beernissagePoster, link: null },
  { image: beernissagePoster, link: null },
  { image: logoB1, link: formLink },
  { image: logoB2, link: formLink },
];
const MAX_MOVING_OBJECTS = 7; // Limit the number of movingObjects

const App: React.FC = () => {
  const [logoCount, setLogoCount] = useState<number>(1); // Start with 1 logo
  const [restrictedArea, setRestrictedArea] = useState<DOMRect | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [activePoster, setActivePoster] = useState<string>('');

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

  function openPopUp(image: string) {
    setActivePoster(image);
    setShowPopUp(true);
    console.log('activePoster: ', activePoster);
  }

  function closePopup() {
    setShowPopUp(false);
  }

  return (
    <>
      <div className="question " ref={questionRef}>
        <p className="rotate1 l1 shadow-link">E</p>
        <p className="l2 shadow-link">AGORA</p>
        <p className="rotate2 l3 shadow-link">?</p>
      </div>

      {Array.from({ length: logoCount }).map((_, index) => (
        <RandomLogo
          key={index}
          movingObjects={movingObjects}
          onClick={(image) => openPopUp(image)}
          restrictedArea={restrictedArea}
        />
      ))}

      {showPopUp && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content">
            <img src={activePoster} alt="Pop-up Poster" />
          </div>
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
