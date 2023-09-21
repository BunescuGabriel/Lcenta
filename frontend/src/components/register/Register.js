import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/register/Register.css';

const baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.baseURL = `${baseURL}/authen`;

const Register = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    error: '',
    success: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = (passwordType) => {
  switch (passwordType) {
    case "password":
      setShowPassword(!showPassword);
      break;
    case "confirm_password":
      setShowConfirmPassword(!showConfirmPassword);
      break;
    default:
      break;
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, username, password, confirm_password } = formData;
    if (password !== confirm_password) {
      setFormData({ ...formData, error: 'Passwords do not match' });
      return;
    }
    if (!formData.email) {
    alertError('Please enter your email.');
    return;
  }
    if (!formData.username) {
    alertError('Please enter your username.');
    return;
  }

  if (!formData.password) {
    alertError('Please enter your password.');
    return;
  }
  if (!formData.confirm_password) {
    alertError('Please enter your confirm password.');
    return;
  }

    axios
      .post('/register/', {
        email,
        username,
        password,
        confirm_password,
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
            console.log(onRegistrationSuccess);
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

  const alertError = (message) => {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert-error';
  alertDiv.textContent = message;

  // Adăugați alertDiv în corpul documentului sau în altă parte corespunzătoare.
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
};

  const { email, username, password, confirm_password, error } = formData;
  return (
    <div className="register">
      <h2 className="register-title">Create your account</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-elementt">
          <label className="label-register">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={email}
            onChange={handleChange}
            className="input-register"
          />
        </div>
        <div className="form-elementt">
          <label className="label-register">Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={handleChange}
            className="input-register"
          />
        </div>
        <div className="form-elementt">
          <label className="label-register">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={handleChange}
            className="input-register"
          />
          <span
            className={`password-tog ${showPassword ? 'active' : ''}`}
            onClick={() => toggleShowPassword('password')}
          >
            {showPassword ? '👁' : '👁'}
          </span>
        </div>
        <div className="form-elementt">
          <label className="label-register">Confirm Password:</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirm_password"
            placeholder="Enter your password Repeat"
            value={confirm_password}
            onChange={handleChange}
            className="input-register"
          />
          <span
            className={`password-tog ${showConfirmPassword ? 'active' : ''}`}
            onClick={() => toggleShowPassword('confirm_password')}
          >
            {showConfirmPassword ? '👁' : '👁'}
          </span>
        </div>
        <div className="form-elementt">
          <button type="submit" className="button-register">
            Sign Up
          </button>
        </div>
        <div className="login-link">
          <h1>
            Already have an account? <Link to="/login" className="login-link">Log in</Link>
          </h1>
        </div>
      </form>
    </div>
  );
};

export default Register;
