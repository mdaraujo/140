import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import RandomLogo from './components/RandomLogo';
import logoB1 from '/logo_b_1.png';
import logoB2 from '/logo_b_2.png';
import logoW1 from '/logo_w_1.png';
import logoW2 from '/logo_w_2.png';

const logos = [logoB1, logoB2, logoW1, logoW2];
const MAX_LOGOS = 10; // Limit the number of logos
const link = 'https://forms.gle/dgnQgUeGjRHgjG2E7';

const App: React.FC = () => {
  const [logoCount, setLogoCount] = useState<number>(1); // Start with 1 logo
  const [restrictedArea, setRestrictedArea] = useState<DOMRect | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  // Add new logos at random intervals
  useEffect(() => {
    if (logoCount <= MAX_LOGOS) {
      const interval = setInterval(
        () => {
          // Ensure we don't exceed the max
          setLogoCount((count) => Math.min(count + 1, MAX_LOGOS));
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

  return (
    <>
      {/* TODO footer */}
      {/* <h1>Associação 140</h1> */}

      <div className="question" ref={questionRef}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <p className="rotate1 l1">E</p>
        </a>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <p className="l2">AGORA</p>
        </a>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <p className="rotate2 l3">?</p>
        </a>
      </div>

      {Array.from({ length: logoCount }).map((_, index) => (
        <RandomLogo
          key={index}
          logos={logos}
          link={link}
          restrictedArea={restrictedArea}
        />
      ))}
    </>
  );
};

export default App;
