import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import '../../styles/admin/BannerMana.css';


function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [name_banner, setNameBanner] = useState('');
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      axios.get('http://localhost:8000/api/produs/banners', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedAccessToken}`,
        },
      })
        .then((response) => {
          setBanners(response.data);
        })
        .catch((error) => {
          console.error('Error fetching banners:', error);
        });

      axios.get('http://localhost:8000/api/users/users-profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedAccessToken}`,
        },
      })
        .then((response) => {
          if (response.status === 200 && response.data.length > 0) {
            const user = response.data[0];
            if (user.user && user.user.email) {
              const userEmail = user.user.email;
              axios.get(`http://localhost:8000/api/users/get-user-id-by-email/${userEmail}/`)
                .then((userResponse) => {
                  setUserId(userResponse.data.user_id);
                  setIsSuperUser(userResponse.data.is_superuser);
                })
                .catch((userError) => {
                  console.error('Error fetching user data:', userError);
                });
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    } else {
      // Tratați cazul în care nu există token de acces
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name_banner') {
      setNameBanner(value);
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBanner(file);
      setSelectedImage(file);
    }
  }

  const createBanner = () => {
    if (isSuperUser) { // Verificați gradul de super-utilizator
      const formData = new FormData();
      formData.append('name_banner', name_banner);
      formData.append('banner', banner);

      axios.post('http://localhost:8000/api/produs/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then(() => {
          fetchBanners();
          setNameBanner('');
          setBanner(null);
          setError(null);
          setSelectedImage(null);
          setIsModalVisible(false);
        })
        .catch((error) => {
          setError(error.response.data.banner);
        });
    } else {
      // Afisați o eroare sau mesaj că utilizatorul nu are privilegii
      setError('Nu aveți privilegii pentru a crea un banner.');
    }
  }

  const deleteBanner = (bannerId) => {
    if (isSuperUser) { // Verificați gradul de super-utilizator
      axios.delete(`http://localhost:8000/api/produs/banners/${bannerId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then(() => {
          fetchBanners();
        })
        .catch((error) => {
          console.error('Error deleting banner:', error);
        });
    } else {

      setError('Nu aveți privilegii pentru a șterge un banner.');
    }
  }

  return (
    <div>
      <h1 className="name-banner">Banner Management</h1>

      <ul>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div className="banner-containe" onClick={() => setIsModalVisible(true)}>
            <div className="banner-imagee">
              <FontAwesomeIcon icon={faPlus} size="4x" /> {/* Use the plus icon */}
            </div>
            <div className="banner-inf">
              <p>Add Banner</p>
            </div>
          </div>
          {banners.slice().reverse().map((banner) => (
            <div key={banner.id} className="banner-conta">
              <div className="banner-imagee">
                <img src={banner.banner} alt={banner.name_banner} />
              </div>
              <div className="banner-inf">
                <p>{banner.name_banner}</p>
              </div>
              <div className="delete-icon" onClick={() => deleteBanner(banner.id)}>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          ))}

        </div>
      </ul>

      {isModalVisible && (
        <div className="modal">
          <div className="modal-contentt">
            <h2>Add Banner</h2>
            <input
              type="text"
              name="name_banner"
              value={name_banner}
              placeholder="Banner Name"
              onChange={handleInputChange}
            />
            <div className="file-upload-container">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <label htmlFor="fileInput" className="file-upload-button">
                {selectedImage ? selectedImage.name : 'Selectează fișierul'}
              </label>
            </div>
            <button onClick={createBanner}>Add Banner</button>
            <button onClick={() => setIsModalVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BannerManager;
