import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.baseURL = `${baseURL}/authen`;

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordToggleActive, setPasswordToggleActive] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  setPasswordToggleActive(!passwordToggleActive);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/login', formData);

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('accessToken', data.access_token);
        console.log(localStorage);

        navigate('/');
      } else {
        console.error('Login error:', response.data);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login">
      <h2 className="login-title">Login</h2>
      <h3 className="login-subtitle">to get access to your files.</h3>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="username" className="input-label">Username and Email</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username or Email"
            value={formData.username}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">
            Password <Link to="/reset-password" className="forgot-password-link">Forgot your password?</Link>
          </label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />
            <span
  className={`password-toggle ${passwordToggleActive ? 'active' : ''}`}
  onClick={toggleShowPassword}
>
  {showPassword ? '👁' : '👁'}
</span>
          </div>
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="register-link">
        <h3>Don't have an account? <Link to="/register" className="register-link">Sing Up</Link></h3>
      </div>
    </div>
  );
}

export default Login;
