import './Socio.css';
import { Navbar, Footer } from '../components/layout';
import { FORMS } from '../data/constants';

function Socio(): JSX.Element {
  return (
    <div className="socio-page">
      <Navbar />
      <main className="socio-content" role="main" aria-labelledby="socio-title">
        <h1 id="socio-title" className="socio-title">
          Torna-te sócio!
        </h1>

        <div className="socio-iframe-wrapper">
          <iframe
            className="socio-iframe"
            src={FORMS.fichaSocio}
            title="Ficha de Sócio - Associação 140"
            aria-label="Formulário para te tornares sócio da Associação 140"
            loading="lazy"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
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
