import React, { useState } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import '../../styles/register/CreateProfil.css';
import {useNavigate} from "react-router-dom";

const CreateProfile = ({ userData, onProfileCreationSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phoneNumber: '',
    birthday: '',
    gender: '2',
    avatar: null,
  });
    const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (acceptedFiles) => {
    // Manipulați încărcarea imaginii aici și actualizați starea avatarului
    const file = acceptedFiles[0]; // Ia doar primul fișier în cazul în care utilizatorul a încărcat mai multe
    setFormData({ ...formData, avatar: file });
  };

  const handleCreateProfile = async () => {
    const { first_name, last_name, phoneNumber, birthday, gender, avatar } = formData;

    if (!userData || !userData.id) {
      console.error('User data is missing or does not contain an ID.');
      return;
    }

    const userId = userData.id;

    // Verificați dacă fiecare câmp este gol și setați-l ca "null" dacă este cazul
    const requestData = {
      user_id: userId,
      first_name: first_name || null,
      last_name: last_name || null,
      phoneNumber: phoneNumber || null,
      birthday: birthday || null,
      gender: gender,
      avatar: avatar || null,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/users/create-profile', requestData);
      console.log('Profile created:', response.data);
      // Pasați user_id către funcția de succes
      onProfileCreationSuccess(response.data.user_id);
      navigate('/login');


      // Puteți redirecționa utilizatorul sau faceți altă acțiune după ce profilul a fost creat
    } catch (error) {
      console.error('Error creating Profile:', error.message);
      // Afișați un mesaj de eroare pentru utilizator
    }
  };

  return (
    <div>
      <div className="profile--container">
        <div className="profile--info">
          <h1 className="create-profile">Create Profile</h1>
          <h2 className="sub-tit">*Do not necessarily fill, click continue Create Profile registration!</h2>
          <div>
            <form>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="form--input"
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="form--input"
              />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="form--input"
              />
             <select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  className="form---input"
>
  <option value="0">Male</option>
  <option value="1">Female</option>
  <option value="2">Not specified</option>
</select>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                placeholder="Birthday"
                className="form--input"
              />
              <Dropzone onDrop={handleImageUpload}>
                {({ getRootProps, getInputProps }) => (
                  <div className="avatarr-containerr" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {formData.avatar ? (
                      <img src={URL.createObjectURL(formData.avatar)} alt="Avatar" className="avatar" />
                    ) : (
                      <p>Click here to upload a new avatar</p>
                    )}
                  </div>
                )}
              </Dropzone>
              <button type="button" onClick={handleCreateProfile} className="form--button">
                Create Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
