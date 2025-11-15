import React, { useEffect, useState, useCallback } from 'react';
import './PopupModal.css';
import { MovingObject } from '../../types/MovingObject';
import { trackCtaClick } from '../../utils/analytics';

interface PopupModalProps {
  isOpen: boolean;
  movingObject: MovingObject | null;
  onClose: () => void;
  showCtaButton?: boolean;
}

const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  movingObject,
  onClose,
  showCtaButton = true,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const handleRequestClose = useCallback(() => {
    if (isClosing) return;
    if (prefersReducedMotion) {
      onClose();
      return;
    }
    setIsClosing(true);
    setIsVisible(false);
    window.setTimeout(() => onClose(), 300); // sync with CSS transition
  }, [isClosing, onClose, prefersReducedMotion]);

  const handleDescriptionClick = useCallback(() => {
    // Close only on mobile viewports
    if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
      handleRequestClose();
    }
  }, [handleRequestClose]);

  // Close on Escape key for accessibility
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleRequestClose();
      }
    }

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [isOpen, handleRequestClose]);

  // Reset closing state whenever the modal is opened again
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      if (prefersReducedMotion) {
        setIsVisible(true);
      } else {
        // let initial styles apply before making visible to avoid flicker
        requestAnimationFrame(() => setIsVisible(true));
      }
    }
  }, [isOpen, prefersReducedMotion]);

  if (!isOpen || !movingObject) return null;

  const hasTickets = !!movingObject.ticketsLink;
  const hasLocation = !!movingObject.location?.url;
  const displayImage = movingObject.modalImage || movingObject.image;
  const locationHref = movingObject.location?.url || undefined;
  const locationName = hasTickets ? movingObject.location?.name || 'Localização' : 'Entrada Livre';
  const ticketHref = movingObject.ticketsLink || undefined;

  return (
    <div
      className={`popup ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Detalhes do evento"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          handleRequestClose();
        }
      }}
    >
      <div className="popup-content" tabIndex={-1}>
        <button
          type="button"
          className="popup-close"
          aria-label="Fechar popup"
          title="Fechar"
          onClick={handleRequestClose}
        >
          ×
        </button>
        <img
          src={displayImage}
          alt="Pop-up Poster"
          role="button"
          tabIndex={0}
          aria-label="Fechar popup"
          onClick={(e) => {
            e.stopPropagation();
            handleRequestClose();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRequestClose();
            }
          }}
        />

        {movingObject.description && (
          <p className="artist-description" onClick={handleDescriptionClick}>
            {movingObject.description}
          </p>
        )}

        {showCtaButton && (hasTickets || hasLocation) && (
          <div className="button-row" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {hasLocation && (
              <a
                href={locationHref}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="button"
                onClick={() =>
                  trackCtaClick({
                    context: 'modal',
                    ctaType: 'location',
                    linkUrl: locationHref as string,
                    linkText: locationName,
                  })
                }
              >
                {locationName}&nbsp; <i className="fa fa-map-marker" aria-hidden="true"></i>
              </a>
            )}
            {hasTickets && (
              <a
                href={ticketHref}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="button"
                onClick={() =>
                  trackCtaClick({
                    context: 'modal',
                    ctaType: 'tickets',
                    linkUrl: ticketHref as string,
                    linkText: 'Comprar bilhetes',
                  })
                }
              >
                Comprar bilhetes&nbsp; <i className="fa fa-ticket" aria-hidden="true"></i>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupModal;
