import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Make a request to your logout endpoint on the server to invalidate the user's session
    fetch('http://localhost:8000/api/authen/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // Logout was successful
          localStorage.removeItem('accessToken'); // Remove the access token from local storage
          // Redirect to the login page or any other desired page
          navigate('/');
        } else {
          // Handle logout error
          console.error('Logout error:', response.statusText);
          // Redirect to an error page or perform other actions as needed
          navigate('/error');
        }
      })
      .catch((error) => {
        console.error('Logout error:', error);
        // Redirect to an error page or perform other actions as needed
        navigate('/error');
      });
  }, [navigate]);

  return (
    <div>
      Logging out...
      {/* You can display a loading spinner or message here */}
    </div>
  );
}

export default Logout;