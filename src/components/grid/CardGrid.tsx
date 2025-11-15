import React from 'react';
import './CardGrid.css';

interface CardGridProps {
  children: React.ReactNode;
  mobileColumns?: 1 | 2;
  desktopColumns?: 2 | 3;
  className?: string;
  role?: string;
  ariaLabel?: string;
}

export function CardGrid({
  children,
  mobileColumns = 2,
  desktopColumns = 3,
  className,
  role,
  ariaLabel,
}: CardGridProps): JSX.Element {
  const classes = [
    'card-grid',
    mobileColumns === 1 ? 'grid-mobile-1' : 'grid-mobile-2',
    desktopColumns === 2 ? 'grid-desktop-2' : 'grid-desktop-3',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <section className={classes} role={role} aria-label={ariaLabel}>
      {children}
    </section>
  );
}

interface ImageCardProps {
  src: string;
  alt?: string;
  onClick?: () => void;
  to?: string;
  ariaLabel?: string;
}

export function ImageCard({
  src,
  alt = 'Imagem',
  onClick,
  to,
  ariaLabel,
}: ImageCardProps): JSX.Element {
  const content = <img src={src} alt={alt} className="image-card-img" />;
  if (to) {
    return (
      <div className="image-card shadow-link">
        <a href={to} aria-label={ariaLabel || alt}>
          {content}
        </a>
      </div>
    );
  }
  if (onClick) {
    return (
      <div className="image-card shadow-link">
        <button type="button" onClick={onClick} aria-label={ariaLabel || alt}>
          {content}
        </button>
      </div>
    );
  }
  // Non-interactive image card (no modal/navigation)
  return <div className="image-card">{content}</div>;
}

interface TextBlockProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function TextBlock({ title, children, className }: TextBlockProps): JSX.Element {
  return (
    <article className={`text-block${className ? ` ${className}` : ''}`}>
      {title ? <h3>{title}</h3> : null}
      <div>{children}</div>
    </article>
  );
}

export default CardGrid;
