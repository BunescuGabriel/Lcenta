import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faShoppingCart, faUser} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Header.css';

function Header() {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    avatar: '',
  });

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAccessToken = localStorage.getItem('accessToken');

        if (storedAccessToken) {
          const userProfileResponse = await axios.get(
            'http://localhost:8000/api/users/users-profile',
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${storedAccessToken}`,
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
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [accessToken]);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // const handleLogout = () => {
  //   // Make a request to your logout endpoint on the server to invalidate the user's session
  //   fetch('http://localhost:8000/api/authen/logout', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         // Logout was successful
  //         localStorage.removeItem('accessToken'); // Remove the access token from local storage
  //         // Redirect to the login page or any other desired page
  //         navigate('/');
  //       } else {
  //         // Handle logout error
  //         console.error('Logout error:', response.statusText);
  //         // Redirect to an error page or perform other actions as needed
  //         navigate('/error');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Logout error:', error);
  //       // Redirect to an error page or perform other actions as needed
  //       navigate('/error');
  //     });
  // };

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

        {isAuthenticated ? (
          <div className="avatar-circle" onClick={toggleMenu} ref={menuRef}>
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt="Avatar"
                className="avatar"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                className="icon"
              />
            )}
            {isDropdownOpen && (
              <ul className="menu">
                {/*<li>{userProfile.first_name} {userProfile.last_name}</li>*/}
                <li className="user-name">{userProfile.first_name} {userProfile.last_name}</li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/logout">Logout</Link></li>
                {/*<li onClick={handleLogout}>Logout</li>*/}
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
