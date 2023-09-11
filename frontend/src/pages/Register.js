import React, { useState } from 'react';
import Header from '../components/Header';
import Register from '../components/register/Register';
import CreateAddress from '../components/register/CreateAddress';
import CreateProfile from "../components/register/CreateProfile";
import '../styles/RegisterPage.css';


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

      {/* Bara de progres */}
      <div className="progress-bar">
        <div className={`step1 ${step >= 1 ? 'active' : ''}`}>Step 1</div>
        <div className={`step2 ${step >= 2 ? 'active' : ''}`}>Step 2</div>
        <div className={`step3 ${step >= 3 ? 'active' : ''}`}>Step 3</div>
      </div>

      {/* Verificați pasul și afișați înregistrarea sau următorul pas (Address sau Profile) */}
      {step === 1 && <Register onRegistrationSuccess={handleRegistrationSuccess} />}

      {step === 2 && (
        <>

          {/* Pasați datele de utilizator către componenta CreateProfile și gestionați trecerea automată */}
          {userData && (
            <CreateProfile userData={userData} onProfileCreationSuccess={handleProfileCreationSuccess} />
          )}
        </>
      )}

      {step === 3 && (
        <>

          {/* Pasați datele de utilizator către componenta CreateAddress */}
          {userData && <CreateAddress userData={userData} />}
        </>
      )}

    </div>
  );
}

export default RegisterPage;
