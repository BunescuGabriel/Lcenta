import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser,faGlobe, faClock  } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Header.css';
import logo from '../images/logo.jpg';
import logo2 from '../images/logo2.png';


function Header() {
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    avatar: '',
  });
  const [userIsSuperUser, setUserIsSuperUser] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const menuRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/users-profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 && response.data.length > 0) {
        const user = response.data[0];
        const updatedUserProfile = {
          first_name: user.first_name,
          last_name: user.last_name,
          avatar: user.avatar,
        };

        if (
          userProfile.first_name !== updatedUserProfile.first_name ||
          userProfile.last_name !== updatedUserProfile.last_name ||
          userProfile.avatar !== updatedUserProfile.avatar
        ) {
          setUserProfile(updatedUserProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserAccess = async () => {
    try {
      const storedAccessToken = localStorage.getItem('accessToken');
      if (storedAccessToken) {
        const response = await axios.get('http://localhost:8000/api/users/users-profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedAccessToken}`,
          },
        });
        if (response.status === 200 && response.data.length > 0) {
          const user = response.data[0];
          if (user.user && user.user.email) {
            const userEmail = user.user.email;
            const userResponse = await axios.get(`http://localhost:8000/api/users/get-user-id-by-email/${userEmail}/`);
            setUserIsSuperUser(userResponse.data.is_superuser > 0);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user access:', error);
    }
  };

  const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    fetchUserAccess();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchUserData();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 90) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <a href="/"><img src={logo} alt="Home" className="logo-img" /></a>
      <nav className="navigation-bar">
        <ul>
          {/*<li><a href="/">Home</a></li>*/}
          <li><a href="/about">About</a></li>
          <li><a href="/conditii">TERMENI ȘI CONDIȚII</a></li>
          {userIsSuperUser && <li><a href="/admin">Admin</a></li>}

        </ul>
      </nav>

      <div className={"LOCAL-TIMING"}>
        <span className="icon-globe"> &#127758;</span>
          {/*  /!*<FontAwesomeIcon icon={faGlobe} className="icon-globe" />*!/*/}
          <li className="horizontal-list">
          <ul>
            <li className={"abcc"}>Bălți</li>
            <li className={"abc"}>Moldova</li>
          </ul>
        </li>
      </div>
        <div className={"LOCAL-TIMING"}>
          <FontAwesomeIcon icon={faClock } className="icon-globee" />
          <li className="horizontal-list">
          <ul>
            <li className={"abcc"}>Luni - Duminică</li>
            <li className={"abc"}>24/24</li>
          </ul>
        </li>
        </div>



      <div className="user-menu">
        {accessToken ? (
          <div className="avatar-circle" onClick={toggleMenu} ref={menuRef}>
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt="Avatar" className="avatar" key={userProfile.avatar} />
            ) : (
              <FontAwesomeIcon icon={faUser} className="icon" />
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
