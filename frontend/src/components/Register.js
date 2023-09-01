import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importați useNavigate
import { Link } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate(); // Obțineți funcția navigate din hook-ul useNavigate

  const [formData, setFormData] = React.useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, username, password, confirm_password } = formData;
    if (password !== confirm_password) {
      setFormData({ ...formData, error: 'Passwords do not match' });
      return;
    }

    axios
      .post('http://localhost:8000/api/authen/register/', {
        email,
        username,
        password,
        confirm_password,
      })
      .then((response) => {
        // După înregistrare cu succes, actualizați starea pentru a afișa mesajul de succes
        setFormData({ ...formData, success: true, error: '' });
        // Utilizați navigate pentru a naviga către pagina "Home"
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
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
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
      </form>
    </div>
  );
};

export default Register;
