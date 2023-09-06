// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.baseURL = `${baseURL}/authen`;

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="button" onClick={toggleShowPassword}>
            {showPassword ? 'Hide' : 'Show'} Password
          </button>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>

        <div>
          <Link to="/reset-password">Reset Password</Link>
        </div>
        <div>
          <button><Link to="/register">Register</Link></button>
        </div>
      </form>
    </div>
  );
}

export default Login;
