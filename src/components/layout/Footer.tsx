import { forwardRef } from 'react';
import { trackCtaClick } from '../../utils/analytics';
import { FORMS } from '../../data/constants';
import './Footer.css';

const Footer = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <footer className="footer" ref={ref}>
      <p>
        <strong>Associação 140</strong>
      </p>
      <p>Movimento Artístico e Sociocultural</p>
      <p>
        <a
          href={FORMS.fichaSocio}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackCtaClick({
              context: 'footer',
              ctaType: 'external_link',
              linkUrl: FORMS.fichaSocio,
              linkText: 'Torna-te sócio!',
            })
          }
        >
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
          onClick={() =>
            trackCtaClick({
              context: 'footer',
              ctaType: 'external_link',
              linkUrl: 'https://www.instagram.com/cento.quarenta/',
              linkText: 'cento.quarenta',
            })
          }
        >
          cento.quarenta
        </a>
      </p>
      <p>
        <i className="fa fa-envelope-o" aria-hidden="true"></i>
        &nbsp;
        <a
          href="mailto:geral@140.pt"
          onClick={() =>
            trackCtaClick({
              context: 'footer',
              ctaType: 'external_link',
              linkUrl: 'mailto:geral@140.pt',
              linkText: 'geral@140.pt',
            })
          }
        >
          geral@140.pt
        </a>
      </p>
      <p>
        <i className="fa fa-copyright" aria-hidden="true"></i>
        &nbsp;2024-2025 Penafiel
      </p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
