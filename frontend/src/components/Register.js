import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.baseURL = `${baseURL}/authen`;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    error: '',
    success: false,
  });

  const [showPassword, setShowPassword] = React.useState(false); // Adăugăm starea pentru a controla vizualizarea parolei

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Inversăm starea la apăsarea butonului
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
        confirm_password,
      })
      .then((response) => {
        setFormData({ ...formData, success: true, error: '' });
        navigate('/');
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
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'} // Schimbăm tipul de input în funcție de starea showPassword
            name="password"
            value={password}
            onChange={handleChange}
          />
          <button type="button" onClick={toggleShowPassword}>
            {showPassword ? 'Hide' : 'Show'} Password
          </button>
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type={showPassword ? 'text' : 'password'} // Schimbăm tipul de input în funcție de starea showPassword
            name="confirm_password"
            value={confirm_password}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
        <div>
          <Link to="/reset-password">Reset Password</Link>
        </div>
        <div>
          <button><Link to="/login">Login</Link></button>
        </div>
      </form>
    </div>
  );
};

export default Register;
