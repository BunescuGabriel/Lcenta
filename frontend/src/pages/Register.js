import React, { useState } from 'react';
import Header from '../components/Header';
import Register from '../components/Register';
import CreateAddress from '../components/CreateAddress';

function RegisterPage() {
  const [userData, setUserData] = useState(null);

  // Funcție pentru a seta datele de utilizator după înregistrare
  const handleRegistrationSuccess = (user_id) => {
    console.log('User registered with ID:', user_id);
    // Actualizați userData cu user_id
    setUserData({ id: user_id });
  };

  return (
    <div>
      <Header />

      <h1>Register Page</h1>
      {/* Pasați funcția de mai sus ca prop pentru componenta Register */}
      <Register onRegistrationSuccess={handleRegistrationSuccess} />

      <h1>Address</h1>
      {/* Pasați datele de utilizator către componenta CreateAddress */}
      {userData && <CreateAddress userData={userData} />}
    </div>
  );
}

export default RegisterPage;
