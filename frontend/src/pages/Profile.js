import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../components/Header";
import '../styles/Profiles.css';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true); // Adăugăm o stare pentru a gestiona încărcarea

  useEffect(() => {
    // Funcția de încărcare a datelor de profil și adresă
    const loadData = async () => {
      try {
        const userProfileResponse = await axios.get('http://localhost:8000/api/users/users-profile');

        setUserProfile(userProfileResponse.data);
        console.log(userProfileResponse)
        setLoading(false); // Setăm loading la false după ce am încărcat datele
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false); // Setăm loading la false și în caz de eroare
      }
    };

    loadData(); // Apelăm funcția de încărcare a datelor la încărcarea componentei
  }, []);

  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="settings-panel">
          <h1>
            Settings
            <FontAwesomeIcon icon={faCog} className="settings-icon" />
          </h1>
        </div>
        <div className="profile-info">
          <h1>User Profile</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <h2>Personal Information:</h2>
              <p>Name: {userProfile.first_name} {userProfile.last_name}</p>
              <p>Email: {userProfile.email}</p>
              <p>Phone Number: {userProfile.phone_number}</p>
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
