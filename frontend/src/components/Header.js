import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Header.css';

function Header() {
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    avatar: '',
  });

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (accessToken) {
      const loadData = async () => {
        try {
          const userProfileResponse = await axios.get(
            'http://localhost:8000/api/users/users-profile',
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (
            userProfileResponse.status === 200 &&
            userProfileResponse.data.length > 0
          ) {
            const user = userProfileResponse.data[0];
            setUserProfile({
              first_name: user.first_name,
              last_name: user.last_name,
              avatar: user.avatar,
            });
            setLoading(false);
          } else {
            console.error('Error loading data:', userProfileResponse);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error loading data:', error);
          setLoading(false);
        }
      };

      loadData();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Efect pentru polling la datele utilizatorului

  useEffect(() => {
    const pollUserProfile = async () => {
      try {
        const userProfileResponse = await axios.get(
          'http://localhost:8000/api/users/users-profile',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (
          userProfileResponse.status === 200 &&
          userProfileResponse.data.length > 0
        ) {
          const user = userProfileResponse.data[0];
          const updatedUserProfile = {
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
          };

          // Verificăm dacă datele utilizatorului s-au schimbat
          if (
            userProfile.first_name !== updatedUserProfile.first_name ||
            userProfile.last_name !== updatedUserProfile.last_name ||
            userProfile.avatar !== updatedUserProfile.avatar
          ) {
            // Dacă s-au schimbat, actualizăm starea
            setUserProfile(updatedUserProfile);
          }
        }
      } catch (error) {
        console.error('Error polling data:', error);
      }
    };

    // Pornim polling-ul la un interval de 5 secunde
    const intervalId = setInterval(() => {
      // Verificăm dacă utilizatorul a făcut logout între timp
      if (!localStorage.getItem('accessToken')) {
        clearInterval(intervalId); // Oprim polling-ul
        setUserProfile({ first_name: '', last_name: '', avatar: '' }); // Resetăm datele utilizatorului
      } else {
        pollUserProfile(); // Efectuăm polling-ul normal
      }
    }, 5000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={`header`}>
      <nav className="navigation-bar">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/despre">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      <div className="user-menu">
        <FontAwesomeIcon icon={faShoppingCart} className="shopping-cart-icon" />

        {accessToken ? (
          <div className="avatar-circle" onClick={toggleMenu} ref={menuRef}>
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt="Avatar"
                className="avatar"
                key={userProfile.avatar}
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                className="icon"
              />
            )}
            {isDropdownOpen && (
              <ul className="menu">
                <li className="user-name">{userProfile.first_name} {userProfile.last_name}</li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/logout">Logout</Link></li>
              </ul>
            )}
          </div>
        ) : (
          <div className="avatar-circle" onClick={toggleMenu} ref={menuRef}>
            <FontAwesomeIcon icon={faUser} className="icon" />
            {isDropdownOpen && (
              <ul className="menu">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
