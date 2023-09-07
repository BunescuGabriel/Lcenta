import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Profiles.css';
import { useNavigate } from "react-router-dom";

const Address = () => {
  const [userAddress, setuserAddress] = useState({
    country: '',
    city: '',
    street: '',
    house_number: '',
    Apartment: '',
  });
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    street: '',
    house_number: '',
    Apartment: '',// Aceasta este valoarea bazei64 a imaginii
  });
  const [showEditForm, setShowEditForm] = useState(false);
const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

// Modificați funcția handleImageUpload


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

  const handleUpdateAddress = async () => {
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
        'http://localhost:8000/api/users/address',
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
        setShowEditForm(false);
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
        const userAddressResponse = await axios.get('http://localhost:8000/api/users/address', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedAccessToken}`,
          },
        });
        if (userAddressResponse.status === 200 && userAddressResponse.data.length > 0) {
          const user = userAddressResponse.data[0];
          setuserAddress({
            country: user.country,
            city: user.city,
            street: user.street,
            house_number: user.house_number,
            Apartment: user.Apartment,
          });
          setLoading(false);
        } else {
          console.error('Error loading data:', userAddressResponse);
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

      <div className="address-container">
        <div className="address-info">
          <h1>User Address</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {/*<h2>Personal Information:</h2>*/}
              <p>Country: {userAddress.country}</p>
              <p>City: {userAddress.city}</p>
              <p>Street: {userAddress.street}</p>
              <p>House Number: {userAddress.house_number}</p>
              <p>Apartment: {userAddress.Apartment}</p>
              <button onClick={() => setShowEditForm(true)}>Edit</button>
            </div>
          )}

          <div>
            <h2>Edit Address:</h2>
            {showEditForm && (
              <form>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street"
                />
                  <input
                  type="text"
                  name="house_number"
                  value={formData.house_number}
                  onChange={handleChange}
                  placeholder="House Number"
                />
               <input
                  type="text"
                  name="Apartment"
                  value={formData.Apartment}
                  onChange={handleChange}
                  placeholder="Apartment"
                />
                {/* Alte câmpuri pentru actualizare */}
                <button type="button" onClick={handleUpdateAddress}>
                  Update Profile
                </button>
                <button type="button" onClick={handleCloseEditForm}>
                  Close
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Address;
