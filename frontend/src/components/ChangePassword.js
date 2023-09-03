import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.baseURL = `${baseURL}/authen`;

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "/change/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Răspuns de la server:", response.data);
      setMessage("Password changed successfully!");
      setError("");

      navigate("/");
    } catch (error) {
      console.error("Eroare de la server:", error.response.data);
      setMessage("");
      setError(error.response.data[0] || "An error occurred.");
    }
  };

  const toggleShowPasswords = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <div>
      <form style={{ maxWidth: "300px", margin: "0 auto" }} onSubmit={handleSubmit}>
        <input
          type={showPasswords ? "text" : "password"}
          name="old_password"
          placeholder="Old password"
          value={formData.old_password}
          onChange={handleChange}
          required
        />
        <input
          type={showPasswords ? "text" : "password"}
          name="new_password"
          placeholder="New password"
          value={formData.new_password}
          onChange={handleChange}
          required
        />
        <input
          type={showPasswords ? "text" : "password"}
          name="confirm_new_password"
          placeholder="Confirm password"
          value={formData.confirm_new_password}
          onChange={handleChange}
          required
        />
        <button type="submit">Confirm</button>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <button onClick={toggleShowPasswords}>
        {showPasswords ? "Hide Passwords" : "Show Passwords"}
      </button>
    </div>
  );
};

export default ChangePassword;
