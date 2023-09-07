import React, { useState } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const CreateProfile = ({ userData, onProfileCreationSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phoneNumber: '',
    birthday: '',
    gender: '2', // Am schimbat '2' cu 'Male' deoarece presupun că gender ar trebui să fie un șir
    avatar: null, // Începeți cu 'null' pentru avatar
  });

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
      gender: gender || null,
      avatar: avatar || null,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/users/create-profile', requestData);
      console.log('Profile created:', response.data);
      // Pasați user_id către funcția de succes
      onProfileCreationSuccess(response.data.user_id);

      // Puteți redirecționa utilizatorul sau faceți altă acțiune după ce profilul a fost creat
    } catch (error) {
      console.error('Error creating Profile:', error.message);
      // Afișați un mesaj de eroare pentru utilizator
    }
  };

  return (
    <div>
      <div className="profile-container">
        <div className="profile-info">
          <h1>Create Profile</h1>
          <div>
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
              <Dropzone onDrop={handleImageUpload}>
                {({ getRootProps, getInputProps }) => (
                  <div className="avatar-container" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {formData.avatar ? (
                      <img src={URL.createObjectURL(formData.avatar)} alt="Avatar" className="avatar" />
                    ) : (
                      <p>Click here to upload a new avatar</p>
                    )}
                  </div>
                )}
              </Dropzone>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                placeholder="Birthday"
              />
              <button type="button" onClick={handleCreateProfile}>
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
