import React, { useState } from 'react';
import axios from 'axios';



const CreateAddress = ({ userData }) => {
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    street: '',
    house_number: '',
    apartment: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAddress = () => {
  const { country, city, street, house_number, apartment } = formData;

  if (!userData || !userData.id) {
    console.error('User data is missing or does not contain an ID.');
    return;
  }

  const userId = userData.id;

  // Actualizați obiectul pentru cerere cu user_id
  const requestData = {
    user_id: userId,
    country,
    city,
    street,
    house_number,
    apartment,
  };

  axios
    .post(`http://localhost:8000/api/users/create-address`, requestData)
    .then((response) => {
      console.log('Address created:', response.data);
      // Puteți redirecționa utilizatorul sau faceți altă acțiune după ce adresa a fost creată
    })
    .catch((error) => {
      console.error('Error creating address:', error);
    });
};


  return (
    <div>
      <div className="address-container">
        <div className="address-info">
          <h1>Create Address</h1>
          <div>
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
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                placeholder="Apartment"
              />
              <button type="button" onClick={handleCreateAddress}>
                Create Address
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAddress;
