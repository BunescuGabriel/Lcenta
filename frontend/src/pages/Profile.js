import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../components/Header";
import '../styles/Profiles.css';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    gender: 0,
    country: '',
    city: '',
    street: '',
    house_number: '',
    apartment: '',
    avatar: [],
  });
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = () => {
    // Redirect to the password reset page
    window.location.href = '/change-password';
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAccessToken = localStorage.getItem("accessToken");

        if (storedAccessToken) {
          const userProfileResponse = await axios.get('http://localhost:8000/api/users/users-profile', {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${storedAccessToken}`,
            },
          });

          // if (userProfileResponse.status === 200) {
          //   setUserProfile(userProfileResponse.data); // Actualizăm starea userProfile cu datele din userProfileResponse
          //   setLoading(false);
            if (userProfileResponse.status === 200 && userProfileResponse.data.length > 0) {
            const user = userProfileResponse.data[0];
            setUserProfile({
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.user.email,
              phoneNumber: user.phoneNumber,
              birthday: user.birthday,
              gender: user.gender,
              country: user.address.country,
              city: user.address.city,
              street: user.address.street,
              house_number: user.address.house_number,
              apartment: user.address.apartment,
              avatar: user.avatar,
            });
            setLoading(false);
            console.log(userProfileResponse)
            console.log(accessToken)
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
  }, [navigate,accessToken]);

  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="settings-panel">
          <h1>
            Settings
            <FontAwesomeIcon icon={faCog} className="settings-icon" />
          </h1>
          <button className="settings-button" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
        <div className="profile-info">
          <h1>User Profile</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <h2>Personal Information:</h2>
              <div className="avatar-container">
                <img src={userProfile.avatar} alt="Avatar" className="avatar" />
              </div>
              <p>Name: {userProfile.first_name} {userProfile.last_name}</p>
              <p>Email: {userProfile.email}</p>
              <p>Phone Number: {userProfile.phoneNumber}</p>
              <p>Date of Birth: {userProfile.birthday}</p>
              <p>Gender: {userProfile.gender === 0 ? 'Male' : userProfile.gender === 1 ? 'Female' : 'Unspecified'}</p>
            </div>
          )}
          <div>
            <h2>Address:</h2>
            <p>Country: {userProfile.country}</p>
            <p>City: {userProfile.city}</p>
            <p>Street: {userProfile.street}</p>
            <p>House Number: {userProfile.house_number}</p>
            <p>Apartment: {userProfile.apartment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
