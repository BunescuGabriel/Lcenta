import React, { useState } from 'react';
import Header from '../components/Header';
import Register from '../components/Register';
import CreateAddress from '../components/CreateAddress';
import CreateProfile from "../components/CreateProfile";

function RegisterPage() {
  const [userData, setUserData] = useState(null);
  const [step, setStep] = useState(1); // Adăugați un state pentru a urmări pașii

  // Funcție pentru a seta datele de utilizator după înregistrare și pentru a trece la următorul pas
  const handleRegistrationSuccess = (user_id) => {
    console.log('User registered with ID:', user_id);
    // Actualizați userData cu user_id
    setUserData({ id: user_id });

    // Trecerea la următorul pas (Profile) automat
    setStep(2);
  };

  // Funcție pentru a trece la următorul pas (Address) automat
  const goToNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  // Funcție pentru a trece la pasul următor (Address) după ce s-a înregistrat profilul
  const handleProfileCreationSuccess = () => {
    // Trecerea la următorul pas (Address) automat
    setStep(3);
  };

  return (
    <div>
      <Header />

      <h1>Register Page</h1>
      {/* Verificați pasul și afișați înregistrarea sau următorul pas (Address sau Profile) */}
      {step === 1 && <Register onRegistrationSuccess={handleRegistrationSuccess} />}

      {step === 2 && (
        <>
          <h1>Profile</h1>
          {/* Pasați datele de utilizator către componenta CreateProfile și gestionați trecerea automată */}
          {userData && (
            <CreateProfile userData={userData} onProfileCreationSuccess={handleProfileCreationSuccess} />
          )}
        </>
      )}

      {step === 3 && (
        <>
          <h1>Address</h1>
          {/* Pasați datele de utilizator către componenta CreateAddress */}
          {userData && <CreateAddress userData={userData} />}
        </>
      )}

      {/* Butonul "Next" pentru a trece la următorul pas (Profile) */}
      {/*{step === 2 && <button onClick={goToNextStep}>Next</button>}*/}
    </div>
  );
}

export default RegisterPage;
