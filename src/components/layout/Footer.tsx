import { forwardRef } from 'react';
import { trackCtaClick } from '../../utils/analytics';
import './Footer.css';

const Footer = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <footer className="footer" ref={ref}>
      <nav className="footer-nav" aria-label="Rodapé">
        <span className="footer-marquee">
          <span className="footer-text">Associação 140</span>
          <span className="footer-text">
            <strong>Movimento Artístico e Sociocultural</strong>
          </span>
          <span className="footer-social">
            <span className="footer-text">Acompanha os nossos projetos</span>
            <span className="footer-icons">
              <a
                href="https://www.instagram.com/cento.quarenta/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir Instagram da Associação 140"
                className="footer-icon"
                onClick={() =>
                  trackCtaClick({
                    context: 'footer',
                    ctaType: 'external_link',
                    linkUrl: 'https://www.instagram.com/cento.quarenta/',
                    linkText: 'instagram',
                  })
                }
              >
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </a>
              <a
                href="mailto:geral@140.pt"
                aria-label="Enviar email para geral@140.pt"
                className="footer-icon"
                onClick={() =>
                  trackCtaClick({
                    context: 'footer',
                    ctaType: 'external_link',
                    linkUrl: 'mailto:geral@140.pt',
                    linkText: 'email',
                  })
                }
              >
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </a>
            </span>
          </span>
          <span className="footer-text">
            <i className="fa fa-copyright" aria-hidden="true"></i>&nbsp;2024-2025 Penafiel
          </span>
        </span>
      </nav>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
