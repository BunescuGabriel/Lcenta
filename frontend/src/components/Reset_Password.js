import React, { useState } from 'react';
import axios from 'axios';

function ResetPassword() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/authen/reset-password', { username });
      if (response.status === 200) {
        setMessage('Password reset email sent successfully');
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
      }
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <input
        type="text"
        placeholder="Username or Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;
