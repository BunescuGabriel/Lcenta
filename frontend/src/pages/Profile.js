import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../components/Header";
import '../styles/Profiles.css';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";



const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({});
  const [userAddress, setUserAddress] = useState({});
  const handleChangePassword = () => {
    // Redirecționează către pagina de resetare a parolei
    window.location.href = '/change-password';
  };
//   const toggleSettingsPanel = () => {
//   const panel = document.querySelector('.settings-panel');
//   panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
// };


  useEffect(() => {
    // Încărcați datele utilizatorului și ale adresei de la server
    axios.get('http://localhost:8000/api/users/users-profile?format=api')
      .then((response) => {
        setUserProfile(response.data);
      })
      .catch((error) => {
        console.error('Eroare la încărcarea profilului:', error);
      });

    axios.get('http://localhost:8000/api/users/address')
      .then((response) => {
        setUserAddress(response.data);
      })
      .catch((error) => {
        console.error('Eroare la încărcarea adresei:', error);
      });
  }, []);

  return (
    <div>
        <Header />


     <div className="profile-container">
  <div className="settings-panel">
    <h1>
      Setări
      <FontAwesomeIcon icon={faCog} className="settings-icon" />
    </h1>
    <button className="settings-button" onClick={handleChangePassword}>
      Change Password
    </button>
  </div>
  <div className="profile-info">
    <h1>Profilul Utilizatorului</h1>
    <div>
      <h2>Informații Personale:</h2>
      <p>Nume: {userProfile.first_name} {userProfile.last_name}</p>
      <p>Email: {userProfile.email}</p>
      <p>Număr de telefon: {userProfile.phoneNumber}</p>
      <p>Data de naștere: {userProfile.birthday}</p>
      <p>Gen: {userProfile.gender === 0 ? 'Masculin' : userProfile.gender === 1 ? 'Feminin' : 'Nespecificat'}</p>
    </div>
    <div>
      <h2>Adresă:</h2>
      <p>Țară: {userAddress.country}</p>
      <p>Oraș: {userAddress.city}</p>
      <p>Stradă: {userAddress.street}</p>
      <p>Număr de casă: {userAddress.house_number}</p>
      <p>Apartament: {userAddress.Apartment}</p>
    </div>
  </div>
</div>
</div>

  );
};

export default ProfilePage;
