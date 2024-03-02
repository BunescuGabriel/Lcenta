import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/produs/ListRating.css';

const ListRating = ({ productId, onUpdateTotalVotes }) => {
  const [ratingCounts, setRatingCounts] = useState([0, 0, 0, 0, 0]);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/produs/ratings-list/${productId}`);
      const ratings = response.data;
      const newRatingCounts = [0, 0, 0, 0, 0];
      let totalVotes = ratings.length;

      ratings.forEach(rating => {
        newRatingCounts[rating.rating - 1]++;
      });

      const ratingPercentages = newRatingCounts.map(count => {
        return (count / totalVotes) * 100;
      });

      ratingPercentages.reverse();

      setRatingCounts(ratingPercentages);
      setTotalVotes(totalVotes);
      onUpdateTotalVotes(totalVotes);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  useEffect(() => {
    fetchRatings(); // Inițial, solicităm datele

    const interval = setInterval(fetchRatings, 5000); // Reîmprospătăm datele la fiecare 5 secunde

    return () => {
      clearInterval(interval); // Oprim intervalul atunci când componenta se demontează
    };
  }, [productId]);

  return (
    <div className="list-rating-container">
      <h1 className="list-rating-title">Ratings and Comments</h1>
      <ul className="list-rating-list">
        {ratingCounts.map((percentage, index) => (
          <li key={index} className="list-rating-item">
            <span>{5 - index}: </span>
            <div className="list-rating-bar">
              <span className="list-rating-value" style={{ width: `${percentage}%` }}>
                {percentage.toFixed(2)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListRating;
