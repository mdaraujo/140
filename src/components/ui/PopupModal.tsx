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
        {hasTickets ? (
          <a
            href={movingObject.ticketsLink!}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={() =>
              trackCtaClick({
                context: 'modal',
                ctaType: 'tickets',
                linkUrl: movingObject.ticketsLink as string,
                linkText: 'Poster',
              })
            }
          >
            <img src={movingObject.image} alt="Pop-up Poster" />
          </a>
        ) : (
          <img
            src={movingObject.image}
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
        )}

        {movingObject.description && (
          <p className="artist-description" onClick={handleDescriptionClick}>
            {movingObject.description}
          </p>
        )}

        {showCtaButton &&
          (hasTickets ? (
            <a
              href={movingObject.ticketsLink!}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="button"
              onClick={() =>
                trackCtaClick({
                  context: 'modal',
                  ctaType: 'tickets',
                  linkUrl: movingObject.ticketsLink as string,
                  linkText: 'E agora? Bilhetes aqui',
                })
              }
            >
              E agora? Bilhetes aqui&nbsp; <i className="fa fa-ticket" aria-hidden="true"></i>
            </a>
          ) : (
            <a
              href={movingObject.location || ''}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="button"
              onClick={() =>
                trackCtaClick({
                  context: 'modal',
                  ctaType: 'location',
                  linkUrl: movingObject.location || '',
                  linkText: 'Entrada Livre',
                })
              }
            >
              Entrada Livre&nbsp; <i className="fa fa-map-marker" aria-hidden="true"></i>
            </a>
          ))}
      </div>
    </div>
  );
};

export default PopupModal;
