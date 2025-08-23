import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import './Navbar.css';
import { Link, NavLink } from 'react-router-dom';

interface NavbarProps {
  className?: string;
}

const Navbar = forwardRef<HTMLElement, NavbarProps>(({ className }, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  // Close menu on route change (basic heuristic: close on hash/path changes)
  useEffect(() => {
    const handler = () => setIsMenuOpen(false);
    window.addEventListener('hashchange', handler);
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('hashchange', handler);
      window.removeEventListener('popstate', handler);
    };
  }, []);

  return (
    <nav
      className={`navbar${className ? ` ${className}` : ''}`}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="brand" aria-label="Associação 140 - Página inicial">
            Associação 140
          </Link>
        </div>

        <div className="navbar-center">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            E Agora?
          </NavLink>
          <NavLink
            to="/passado"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            E o que foi?
          </NavLink>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="hamburger"
            aria-label="Abrir menu"
            aria-controls="navbar-menu"
            aria-expanded={isMenuOpen}
            onClick={handleToggleMenu}
          >
            <span aria-hidden="true" className="hamburger-bars" />
          </button>
        </div>
      </div>

      <div
        id="navbar-menu"
        className={`navbar-menu${isMenuOpen ? ' open' : ''}`}
        role="menu"
        aria-label="Navegação"
      >
        <NavLink to="/" className="menu-link" role="menuitem" onClick={() => setIsMenuOpen(false)}>
          E Agora?
        </NavLink>
        <NavLink
          to="/passado"
          className="menu-link"
          role="menuitem"
          onClick={() => setIsMenuOpen(false)}
        >
          E o que foi?
        </NavLink>
      </div>
    </nav>
  );
});

export default Navbar;


