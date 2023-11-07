import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/profile/Profiles.css';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    gender: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phoneNumber: '',
    birthday: '',
    gender: '',
    avatar: '',
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleOpenEditForm = () => {
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

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

  const handleImageUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setAvatarFile(file);
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedData = { ...formData };
      const updatedFormData = new FormData();

      for (const key in updatedData) {
        if (updatedData[key] !== '') {
          updatedFormData.append(key, updatedData[key]);
        }
      }

      if (avatarFile) {
        updatedFormData.append('avatar', avatarFile);
      }

      const response = await axios.patch(
        'http://localhost:8000/api/users/users-profile',
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        loadData();
        setShowEditForm(false);
        alertSuccess('Profile Update!');
      setTimeout(() => {
      }, );
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

  const alertSuccess = (message) => {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert-success';
  alertDiv.textContent = message;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
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
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (

              <div className="column-profile">
  <div className="column-container">
    <div className="column-left">
      <h2 className="section-title">Personal Information</h2>
      <p className="info-label">Name: {userProfile.first_name} {userProfile.last_name}</p>
      <p className="info-label">Email: {userProfile.email}</p>
      <p className="info-label">Phone Number: {userProfile.phoneNumber}</p>
      <p className="info-label">Date of Birth: {userProfile.birthday}</p>
      <p className="info-label">Gender: {userProfile.gender === 0 ? 'Male' : userProfile.gender === 1 ? 'Female' : 'Unspecified'}</p>
      <button className="edit-button" onClick={handleOpenEditForm}>Edit</button>
    </div>
    <div className="column-right">
      <div className="avatarr-container">
        <img src={userProfile.avatar} alt="Avatar" className="avatarr" />
      </div>
    </div>
  </div>
</div>
          )}
        </div>
      </div>

      {showEditForm && (
        <div className="modall">
          <div className="modal-contentt">
            <h2 className="editt-title">Edit Profile:</h2>
            <form>
              <label htmlFor="first_name" className="form-label">First Name:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="form-input"
              />
              <label htmlFor="last_name" className="form-label">Last Name:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="form-input"
              />
              <label htmlFor="phoneNumber" className="form-label">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="form-input"
              />
              <label htmlFor="birthday" className="form-label">Birthday:</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                placeholder="Birthday"
                className="form-input"
              />
              <label htmlFor="gender" className="form-label">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
              >
                <option value="2">Not specified</option>
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
              <Dropzone onDrop={handleImageUpload}>
                {({ getRootProps, getInputProps }) => (
                  <div className="avatar-upload-container" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <img src={userProfile.avatar} alt="Avatar" className="avatar" />
                    <p className="avatar-upload-text">Click here to upload a new avatar</p>
                  </div>
                )}
              </Dropzone>
              <button type="button" className="update-button-profile" onClick={handleUpdateProfile}>
                Update Profile
              </button>
              <button type="button" className="close-button-profile" onClick={handleCloseEditForm}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
