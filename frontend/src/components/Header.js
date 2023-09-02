// src/components/Header.js
import React, { useState } from 'react';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('accessToken'); // Verifică dacă utilizatorul este autentificat

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here (e.g., remove the access token)
    localStorage.removeItem('accessToken');
    // Puteți, de asemenea, să redirecționați utilizatorul către pagina de autentificare sau să efectuați alte acțiuni
  };

  return (
    <header className={`header `}>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/despre">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      <div className="circle" onClick={toggleMenu}>
        {isAuthenticated ? (
          <>
            <FontAwesomeIcon icon={faUser} className="icon" />
            {isMenuOpen && (
              <ul className="menu">
                {/* Display the user's name */}
                <li>Logged in as {'username'}</li> {/* Trebuie să înlocuiți {'username'} cu numele real al utilizatorului */}
                <li><Link to="/profile">Profile</Link></li>
                <li onClick={handleLogout}><Link to="/">Logout</Link></li>
              </ul>
            )}
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faUser} className="icon" />
            {isMenuOpen && (
              <ul className="menu">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                  <li><Link to="/reset-password">Reset Password</Link></li>
              </ul>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
