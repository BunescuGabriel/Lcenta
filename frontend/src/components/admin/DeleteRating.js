import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../styles/produs/Comments.css';
import { format } from 'date-fns';

const DeleteRating = ({ productId }) => {
  const [ratings, setRatings] = useState([]);
  const [userNames, setUserNames] = useState({});

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/profile/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/produs/car/${productId}/ratings/`);
      setRatings(response.data);
      // console.log(response);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [productId]);

  useEffect(() => {
    const fetchUserNames = async () => {
      const userNamesData = {};
      for (const rating of ratings) {
        const userInfo = await fetchUserInfo(rating.user_id);
        if (userInfo) {
          userNamesData[rating.user_id] = {
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            avatar: userInfo.avatar,
          };
        }
      }
      setUserNames(userNamesData);
    };

    if (ratings.length > 0) {
      fetchUserNames();
    }
  }, [ratings]);

  const handleDeleteRating = (ratingId) => {
    axios
      .delete(`http://localhost:8000/api/produs/car/${productId}/rating/${ratingId}`)
      .then(() => {
        fetchRatings();
      })
      .catch((error) => {
        console.error('Error deleting rating:', error);
      });
  };

  return (
    <div className="comments-container">
      <ul className="comments-list">
        {ratings.slice().reverse().map((rating) => (
          <li key={rating.id} className="comment-item">
            <div className="user-info">
              {userNames[rating.user_id] ? (
                <img
                  src={userNames[rating.user_id].avatar}
                  alt={`Avatar for ${userNames[rating.user_id].firstName} ${userNames[rating.user_id].lastName}`}
                  className="avatar"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="avatar" />
              )}
              <div className="user-details">
                <p className="user-name">
                  {userNames[rating.user_id]
                    ? `${userNames[rating.user_id].firstName} ${userNames[rating.user_id].lastName}`
                    : 'Unknown User'}
                </p>
                <p className="comment-text">{rating.rating}</p>
              </div>
            </div>
            <p className="comment-date">
              {format(new Date(rating.create_da), 'dd.MM.yyyy HH:mm')}
            </p>
            <FontAwesomeIcon
              icon={faTimes}
              className="deletee-icon"
              onClick={() => handleDeleteRating(rating.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeleteRating;
