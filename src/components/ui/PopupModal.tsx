import React, { useEffect, useState, useCallback } from 'react';
import './PopupModal.css';
import { MovingObject } from '../../types/MovingObject';

interface PopupModalProps {
  isOpen: boolean;
  movingObject: MovingObject | null;
  onClose: () => void;
}

const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  movingObject,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleRequestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsVisible(false);
    window.setTimeout(() => onClose(), 300); // sync with CSS transition fallback
  }, [isClosing, onClose]);

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
      // let initial styles apply before making visible to avoid flicker
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [isOpen]);

  if (!isOpen || !movingObject) return null;

  const hasTickets = !!movingObject.ticketsLink;

  return (
    <div
      className={`popup ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Detalhes do evento"
      onClick={handleRequestClose}
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
            onClick={(e) => e.stopPropagation()}
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
          <p className="artist-description">{movingObject.description}</p>
        )}

        {hasTickets ? (
          <a
            href={movingObject.ticketsLink!}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="button"
            onClick={(e) => e.stopPropagation()}
          >
            E agora? Bilhetes aqui&nbsp;{' '}
            <i className="fa fa-ticket" aria-hidden="true"></i>
          </a>
        ) : (
          <a
            href={movingObject.location || ''}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="button"
            onClick={(e) => e.stopPropagation()}
          >
            Entrada Livre&nbsp;{' '}
            <i className="fa fa-map-marker" aria-hidden="true"></i>
          </a>
        )}
      </div>
    </div>
  );
};

export default PopupModal;
