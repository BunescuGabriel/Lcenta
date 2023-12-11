import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/produs/ListRating.css';

const ListRating = ({ productId, onUpdateTotalVotes   }) => {
  const [ratings, setRatings] = useState([]);
  const [ratingCounts, setRatingCounts] = useState([0, 0, 0, 0, 0]);

  const fetchData = () => {
    axios.get(`http://localhost:8000/api/produs/ratings-list/${productId}`)
      .then(response => {
        setRatings(response.data);
        onUpdateTotalVotes(response.data.length);
      })
      .catch(error => {
        console.error('Eroare la preluarea datelor:', error);
      });
  };

  useEffect(() => {
    fetchData(); // Inițial, solicităm datele

    const refreshInterval = setInterval(() => {
      fetchData(); // Reîmprospătăm datele la fiecare 5 secunde
    }, 1000);

    return () => {
      clearInterval(refreshInterval); // Oprim intervalul atunci când componenta se demontează
    }
  }, [productId]);

  useEffect(() => {
    const newRatingCounts = [0, 0, 0, 0, 0];

    ratings.forEach(rating => {
      newRatingCounts[rating.rating - 1]++;
    });

    const totalVotes = ratings.length;

    const ratingPercentages = newRatingCounts.map(count => {
      return (count / totalVotes) * 100;
    });

    ratingPercentages.reverse();

    setRatingCounts(ratingPercentages);
  }, [ratings]);

  return (
    <div className="list-rating-container">
      <h1 className="list-rating-title">Ratings and Comments </h1>
      {/*<p>Total Votes: {ratings.length}</p>*/}
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
}

export default ListRating;
