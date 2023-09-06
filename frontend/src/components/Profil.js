import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../components/Header";
import '../styles/Profiles.css';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    gender: 0,
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phoneNumber: '',
    birthday: '',
    gender: 0,
    avatar: '', // Aceasta este valoarea bazei64 a imaginii
  });
  const [showEditForm, setShowEditForm] = useState(false);


// Modificați funcția handleImageUpload

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      // Obiect pentru actualizarea profilului
      const updatedData = {};
      for (const key in formData) {
        if (formData[key] !== '') {
          updatedData[key] = formData[key];
        }
      }


      if (Object.keys(updatedData).length === 0) {
        // Nu sunt câmpuri de actualizat
        return;
      }

      // Adăugați obiectul adresei la obiectul de actualizare a profilului

      const response = await axios.patch(
        'http://localhost:8000/api/users/users-profile',
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        // După actualizare, reîncărcați datele utilizatorului
        loadData();
      } else {
        // Tratați cazurile de eroare aici
      }
    } catch (error) {
      // Tratați erorile aici
    }
  };

  const loadData = async () => {
    try {
      const storedAccessToken = localStorage.getItem("accessToken");

      if (storedAccessToken) {
        const userProfileResponse = await axios.get('http://localhost:8000/api/users/users-profile', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedAccessToken}`,
          },
        });
        if (userProfileResponse.status === 200 && userProfileResponse.data.length > 0) {
          const user = userProfileResponse.data[0];
          setUserProfile({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.user.email,
            phoneNumber: user.phoneNumber,
            birthday: user.birthday,
            gender: user.gender,
            avatar: user.avatar,
          });
          setLoading(false);
        } else {
          console.error('Error loading data:', userProfileResponse);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate, accessToken]);

  return (
    <div>

      <div className="profile-container">
        <div className="settings-panel">
          <h1>
            Settings
            <FontAwesomeIcon icon={faCog} className="settings-icon" />
          </h1>
          <button className="settings-button" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
        <div className="profile-info">
          <h1>User Profile</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <h2>Personal Information:</h2>
              <div className="avatar-container">
                <img src={userProfile.avatar} alt="Avatar" className="avatar" />
              </div>
              <p>Name: {userProfile.first_name} {userProfile.last_name}</p>
              <p>Email: {userProfile.email}</p>
              <p>Phone Number: {userProfile.phoneNumber}</p>
              <p>Date of Birth: {userProfile.birthday}</p>
              <p>Gender: {userProfile.gender === 0 ? 'Male' : userProfile.gender === 1 ? 'Female' : 'Unspecified'}</p>
              <button onClick={() => setShowEditForm(true)}>Edit</button>
            </div>
          )}

          <div>
            <h2>Edit Profile:</h2>
            {showEditForm && (
              <form>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Gender"
                />
               <input
  type="file"
  accept="image/*"
  name="avatar"
  value={formData.avatar}
  onChange={handleChange}
/>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  placeholder="Birthday"
                />
                {/* Alte câmpuri pentru actualizare */}
                <button type="button" onClick={handleUpdateProfile}>
                  Update Profile
                </button>
              </form>
            )}
          </div>

          <div>
            <h2>Address:</h2>
            <div>
              <p>Country: {userProfile.country}</p>
              <p>City: {userProfile.city}</p>
              <p>Street: {userProfile.street}</p>
              <p>House Number: {userProfile.house_number}</p>
              <p>Apartment: {userProfile.apartment}</p>
              {/*<button onClick={() => setShowEditForm(true)}>Edit</button>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
