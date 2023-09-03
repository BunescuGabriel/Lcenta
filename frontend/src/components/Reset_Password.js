import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from "axios";
//
// const baseURL = process.env.REACT_APP_BASE_URL;
// axios.defaults.baseURL = `${baseURL}/authen`;

function ResetPassword() {
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');


  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleResetPassword = () => {
    fetch('http://localhost:8000/api/authen/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        if (data.status === 'success') {
          // Redirect to the home page ("/") after a successful password reset
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('A apărut o eroare la resetarea parolei.');
      });
     navigate('/Login'); // Change this to the appropriate route
  };

  return (
    <div>
      <h2>Resetare Parolă</h2>
      <div>
        <label htmlFor="username">Introduceți email sau nume de utilizator:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <button onClick={handleResetPassword}>Resetare Parolă</button>
      </div>
      {message && <div>{message}</div>}
    </div>
  );
}

export default ResetPassword;
