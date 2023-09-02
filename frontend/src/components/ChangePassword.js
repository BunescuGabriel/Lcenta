import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        "http://localhost:8000/api/authen/change/",
        formData
      );

      // Verificați răspunsul de la server și gestionați-l în consecință.
      console.log("Răspuns de la server:", response.data);
      setMessage("Password changed successfully!");
      setError(""); // Resetăm eroarea

      // Puteți adăuga aici logică suplimentară pentru a trata răspunsul de la server.
    } catch (error) {
      console.error("Eroare de la server:", error.response.data);
      setMessage(""); // Resetăm mesajul
      setError(error.response.data.error || "An error occurred.");

      // Puteți gestiona erorile de la server aici.
    }
  };

  const toggleShowPasswords = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <div>
      <form style={{ maxWidth: "300px", margin: "0 auto" }}>
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
        <button onClick={handleSubmit}>Confirm</button>
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
