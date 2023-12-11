import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConditiiComponent = () => {
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    // Fetch all conditions
    axios.get('http://localhost:8000/api/about/conditi/')
      .then(response => {
        setConditions(response.data);
      })
      .catch(error => {
        console.error('Error fetching conditions:', error);
      });
  }, []);

  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    // Fetch descriptions for each condition
    conditions.forEach(condition => {
      axios.get(`http://localhost:8000/api/about/conditii/${condition.id}`)
        .then(response => {
          setDescriptions(prevDescriptions => ({
            ...prevDescriptions,
            [condition.id]: response.data.descrierii,
          }));
        })
        .catch(error => {
          console.error(`Error fetching condition ${condition.id} details:`, error);
        });
    });
  }, [conditions]);

  return (
    <div>
      <h2>Conditions</h2>
      {conditions.map(condition => (
        <div key={condition.id}>
          <h3>{condition.titlu}</h3>
          <h2>{condition.text}</h2>
          {descriptions[condition.id] ? (
            <ul>
              {descriptions[condition.id].map(description => (
                <li key={description.id}>{description.descrierea}</li>
              ))}
            </ul>
          ) : (
            <p>Loading description...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConditiiComponent;
