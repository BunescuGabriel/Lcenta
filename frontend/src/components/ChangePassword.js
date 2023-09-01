import React, { useState } from 'react';
import axios from 'axios';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'oldPassword') setOldPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmNewPassword') setConfirmNewPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch('http://localhost:8000/api/authen/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });

      if (response.status === 200) {

      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data[0]);
      }
    }
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={oldPassword}
          onChange={handleChange}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={handleChange}
        />
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;
