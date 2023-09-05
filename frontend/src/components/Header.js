import React, { useEffect, useState, useRef } from 'react';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    avatar: '',
  });

   const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

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
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
  };

  return (
    <header className={`header`}>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/despre">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      <div className="user-menu">
        {isAuthenticated ? (
          <>
            {userProfile.avatar ? (
              <div className="avatar-circle" onClick={toggleMenu} ref={menuRef}>
                <img
                  src={userProfile.avatar}
                  alt="Avatar"
                  className="avatar"
                />
              </div>
            ) : (
              <div className="avatar-circle" onClick={toggleMenu}>
                <FontAwesomeIcon
                  icon={faUser}
                  className="icon"
                />
              </div>
            )}
            {isDropdownOpen && (
              <ul className="menu">
                <li>{userProfile.first_name} {userProfile.last_name}</li>
                <li><Link to="/profile">Profile</Link></li>
                <li onClick={handleLogout}><Link to="/">Logout</Link></li>
              </ul>
            )}
          </>
        ) : (
          <>
            <div className="avatar-circle" onClick={toggleMenu} ref={menuRef}>
              <FontAwesomeIcon icon={faUser} className="icon" />
            </div>


            <div className="menu-container">
    {isDropdownOpen && (
      <ul className="menu">
        <li>{userProfile.first_name} {userProfile.last_name}</li>
        <li><Link to="/profile">Profile</Link></li>
        <li onClick={handleLogout}><Link to="/">Logout</Link></li>
      </ul>
    )}
  </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
