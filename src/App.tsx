import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import RandomLogo from './components/RandomLogo';
// import logoB1 from '/logo_b_1.png';
// import logoB2 from '/logo_b_2.png';
import logoW1 from '/logo_w_1.png';
import logoW2 from '/logo_w_2.png';
import posterAteJa from '/ATE_JA.jpeg';
import { MovingObject } from './types/MovingObject';

const formLink = 'https://forms.gle/dgnQgUeGjRHgjG2E7';

const movingObjects: MovingObject[] = [
  { image: posterAteJa, link: null },
  { image: posterAteJa, link: null },
  { image: posterAteJa, link: null },
  { image: posterAteJa, link: null },
  { image: logoW1, link: formLink },
  { image: logoW2, link: formLink },
];
const MAX_MOVING_OBJECTS = 7; // Limit the number of movingObjects

const App: React.FC = () => {
  const [logoCount, setLogoCount] = useState<number>(1); // Start with 1 logo
  const [restrictedArea, setRestrictedArea] = useState<DOMRect | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);

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

  function openPopUp() {
    setShowPopUp(true);
  }

  function closePopup() {
    setShowPopUp(false);
  }

  return (
    <>
      {/* <div className="question " ref={questionRef}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <p className="rotate1 l1 shadow-link">E</p>
        </a>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <p className="l2 shadow-link">AGORA</p>
        </a>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <p className="rotate2 l3 shadow-link">?</p>
        </a>
      </div> */}

      <div className="question " ref={questionRef}>
        <p className="rotate1 l1 shadow-link" onClick={openPopUp}>
          E
        </p>
        <p className="l2 shadow-link" onClick={openPopUp}>
          AGORA
        </p>

        <p className="rotate2 l3 shadow-link" onClick={openPopUp}>
          ?
        </p>
      </div>

      {Array.from({ length: logoCount }).map((_, index) => (
        <RandomLogo
          key={index}
          movingObjects={movingObjects}
          onClick={openPopUp}
          restrictedArea={restrictedArea}
        />
      ))}

      {showPopUp && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content">
            <img src={posterAteJa} alt="Pop-up Poster" />
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
