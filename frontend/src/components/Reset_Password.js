import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Forgot.css'; // Make sure to adjust the import path for your CSS file

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
    <div className="reset-password-container">
      <h2 className="reset-password-heading">Password Reset</h2>
      <div className="form-group">
        <label htmlFor="username" className="form-labell">
          Enter email or username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your Username or Email"
          value={username}
          onChange={handleInputChange}
          className="form-inputt"
        />
      </div>
      <div>
        <button onClick={handleResetPassword} className="reset-button">
          Reset
        </button>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default ResetPassword;
