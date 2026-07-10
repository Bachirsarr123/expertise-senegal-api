import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-container">
            <img src={logoImg} alt="Expertise Sénégal Logo" className="navbar-logo-img" />
          </div>
        </Link>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li>
              <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink to="/a-propos" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
                À Propos
              </NavLink>
            </li>
            <li>
              <NavLink to="/domaines" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
                Domaines d'Activité
              </NavLink>
            </li>
            <li>
              <NavLink to="/seminaires" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
                Catalogue Formation
              </NavLink>
            </li>
            <li>
              <NavLink to="/references" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
                Nos Références
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
                Contact
              </NavLink>
            </li>
          </ul>
          
          <div className="navbar-cta-mobile">
            <Link to="/contact" className="btn btn-primary" onClick={closeMenu}>
              Demander un Devis
            </Link>
          </div>
        </div>

        <div className="navbar-cta-desktop">
          <Link to="/contact" className="btn btn-primary">
            Demander un Devis
          </Link>
        </div>

        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
