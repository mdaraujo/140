import './Socio.css';
import { Navbar, Footer } from '../components/layout';
import { FORMS } from '../data/constants';
import logoWhite from '/logo_w_1.png';

function Socio(): JSX.Element {
  const SOCIO_BENEFITS: ReadonlyArray<string> = [
    'Desconto nos Eventos',
    'MERCH oficial',
    'Comunidade Artística e Sócio Cultural',
    'Desconto no BAR',
  ];
  const NUM_TRACK_REPEATS = 4;

  return (
    <div className="socio-page">
      <Navbar />
      <main className="socio-content" role="main" aria-labelledby="socio-title">
        <h1 id="socio-title" className="socio-title sr-only">
          Torna-te sócio!
        </h1>

        <div className="socio-hero">
          <img className="socio-logo" src={logoWhite} alt="Associação 140" width={40} />
          <div className="socio-marquee" role="region" aria-label="Vantagens de ser sócio">
            <div className="socio-marquee-inner" aria-hidden="true">
              {Array.from({ length: NUM_TRACK_REPEATS }, (_, trackIndex) => (
                <ul className="socio-marquee-track" key={`track-${trackIndex}`}>
                  {SOCIO_BENEFITS.map((item) => (
                    <li className="socio-chip" key={`t${trackIndex}-${item}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <ul className="socio-benefits-list">
              {SOCIO_BENEFITS.map((item) => (
                <li key={`sr-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="socio-iframe-wrapper">
          <iframe
            className="socio-iframe"
            src={FORMS.fichaSocioEmbed}
            title="Ficha de Sócio - Associação 140"
            aria-label="Formulário para te tornares sócio da Associação 140"
            loading="lazy"
            allow="clipboard-write; fullscreen"
          />
        </div>

        <p className="socio-fallback">
          Se não conseguires ver o formulário, abre-o{' '}
          <a
            className="socio-inline-link"
            href={FORMS.fichaSocio}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir formulário de sócio numa nova janela"
          >
            aqui
          </a>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default Socio;
