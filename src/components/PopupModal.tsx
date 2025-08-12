import React, { useEffect } from 'react';
import { MovingObject } from '../types/MovingObject';

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
  // Close on Escape key for accessibility
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [isOpen, onClose]);

  if (!isOpen || !movingObject) return null;

  const hasTickets = !!movingObject.ticketsLink;

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-content">
        {hasTickets ? (
          <a href={movingObject.ticketsLink!} target="_blank">
            <img src={movingObject.image} alt="Pop-up Poster" />
          </a>
        ) : (
          <img src={movingObject.image} alt="Pop-up Poster" />
        )}

        {movingObject.description && (
          <p className="artist-description">{movingObject.description}</p>
        )}

        {hasTickets ? (
          <a
            href={movingObject.ticketsLink!}
            target="_blank"
            className="button shadow-link"
          >
            E agora? Bilhetes aqui&nbsp;{' '}
            <i className="fa fa-ticket" aria-hidden="true"></i>
          </a>
        ) : (
          <a
            href={movingObject.location || ''}
            target="_blank"
            className="button shadow-link"
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
