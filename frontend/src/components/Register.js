import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';

const baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.baseURL = `${baseURL}/authen`;

const Register = ({ onRegistrationSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    error: '',
    success: false,
  });
  const [showPassword, setShowPassword] = useState(false);
const [passwordToggleActive, setPasswordToggleActive] = useState(false);

const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [confirmPasswordToggleActive, setConfirmPasswordToggleActive] = useState(false);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = (field) => {
  if (field === 'password') {
    setShowPassword(!showPassword);
    setPasswordToggleActive(!passwordToggleActive);
  } else if (field === 'confirm_password') {
    setShowConfirmPassword(!showConfirmPassword);
    setConfirmPasswordToggleActive(!confirmPasswordToggleActive);
  }
};



  const handleSubmit = (e) => {
  e.preventDefault();
  const { email, username, password, confirm_password } = formData;
  if (password !== confirm_password) {
    setFormData({ ...formData, error: 'Passwords do not match' });
    return;
  }

  axios
    .post('/register/', {
      email,
      username,
      password,
      confirm_password
    })
    .then(() => {
      setFormData({ ...formData, success: true, error: '' });

      // După înregistrare, faceți o cerere pentru a obține ID-ul utilizatorului
      axios
        .get(`http://localhost:8000/api/users/get-user-id-by-email/${email}/`)
        .then((response) => {
          const { user_id } = response.data;

          // Pasați user_id către funcția de succes
          onRegistrationSuccess(user_id);
          console.log(onRegistrationSuccess)
        })
        .catch((error) => {
          console.error('Error getting user ID:', error);
        });
    })
    .catch((error) => {
      if (error.response) {
        setFormData({ ...formData, error: error.response.data });
      } else {
        setFormData({ ...formData, error: 'An error occurred while registering' });
      }
    });
};



  const { email, username, password, confirm_password, error } = formData;
  return (
    <div>
      <h2>Create your account</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div>
  <label>Password:</label>
  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    placeholder="Enter your password"
    value={password}
    onChange={handleChange}
  />
  <span
    className={`password-toggle ${passwordToggleActive ? 'active' : ''}`}
    onClick={() => toggleShowPassword('password')}
  >
    {showPassword ? '👁' : '👁'}
  </span>
</div>
<div>
  <label>Confirm Password:</label>
  <input
    type={showConfirmPassword ? 'text' : 'password'}
    name="confirm_password"
    placeholder="Enter your password Repeat"
    value={confirm_password}
    onChange={handleChange}
  />
  <span
    className={`password-toggle ${confirmPasswordToggleActive ? 'active' : ''}`}
    onClick={() => toggleShowPassword('confirm_password')}
  >
    {showConfirmPassword ? '👁' : '👁'}
  </span>
</div>


        <div>
          <button type="submit">Sing Up</button>
        </div>
        <div>
        <h1s>Already have an account?  <Link to="/login">Log in</Link></h1s>
      </div>
      </form>
    </div>
  );
};

export default Register;
