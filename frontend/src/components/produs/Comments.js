import React, { useEffect, useState } from 'react';
import axios from 'axios'; // You need to install Axios
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import '../../styles/produs/Comments.css';
import { format } from 'date-fns';

const ProductComments = ({ productId }) => {
  const [comments, setComments] = useState([]);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/profile/${userId}/`); // Înlocuiți cu endpoint-ul corect pentru obținerea informațiilor despre utilizator
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/produs/comments-list/${productId}`); // Replace with your API endpoint
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();

    const refreshInterval = setInterval(fetchComments, 10000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [productId]);

  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchUserNames = async () => {
      const userNamesData = {};
      for (const comment of comments) {
        const userInfo = await fetchUserInfo(comment.user_id);
        if (userInfo) {
          userNamesData[comment.user_id] = {
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            avatar: userInfo.avatar,
          };
        }
      }
      setUserNames(userNamesData);
    };

    if (comments.length > 0) {
      fetchUserNames();
    }
  }, [comments]);

  return (
    <div className="comments-container">
      <ul className="comments-list">
        {comments.slice().reverse().map((comment) => (
          <li key={comment.id} className="comment-item">
            <div className="user-info">
              {userNames[comment.user_id] ? (
                <img
                  src={userNames[comment.user_id].avatar}
                  alt={`Avatar for ${userNames[comment.user_id].firstName} ${userNames[comment.user_id].lastName}`}
                  className="avatar"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="avatar" />
              )}
              <div className="user-details">
                <p className="user-name">
                  {userNames[comment.user_id]
                    ? `${userNames[comment.user_id].firstName} ${userNames[comment.user_id].lastName}`
                    : 'Unknown User'}
                </p>
                <p className="comment-text">{comment.comment}</p>
              </div>
            </div>
            <p className="comment-date">
              {format(new Date(comment.created_at), 'dd.MM.yyyy HH:mm')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductComments;
