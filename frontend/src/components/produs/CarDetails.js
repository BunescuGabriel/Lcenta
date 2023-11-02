import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../../styles/produs/CarDetails.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


import {
    faCar,
    faCarSide,
    faCog,
    faGasPump,
    faTachometerAlt,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Carousel } from 'react-responsive-carousel';
import ProductComments from "./Comments";
import AddComment from "./AddComments";
import Rating from "./Rating";
import ListRating from "./List_Rating";


const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  // Add a new state for the total_rating
  const [totalRating, setTotalRating] = useState(0);

  // Create a function to fetch the car data
  const fetchCarData = () => {
    fetch(`http://localhost:8000/api/produs/car/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCar(data);
        setTotalRating(data.total_rating); // Update totalRating state
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
      });
  };

  useEffect(() => {
    // Initial fetch when the component mounts
    fetchCarData();

    // Set up an interval to periodically fetch data (e.g., every 30 seconds)
    const interval = setInterval(fetchCarData, 5000); // 30 seconds in milliseconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [id]);



  if (!car) {
    return <div>Loading...</div>;
  }


  return (
      <div>
    <div className="car-detail">
      <div className="column1">

        <Carousel showStatus={false} showThumbs={true} infiniteLoop={true}>
      {car.images.map((image, index) => (
        <div key={index}>
          <img src={image.image} alt={`Image ${index}`} />
          <p className="legend">{image.title}</p> {/* Adăugați un titlu pentru fiecare imagine, dacă doriți */}
        </div>
      ))}
    </Carousel>
        <Rating productId={id} />
        <p className="car-info">{totalRating}</p>

        <ListRating productId={id} />
      </div>

      <div className="column2">
        <p className="car-info">
          {car.producator} {car.name}
        </p>

         <div className="car-detail">
      <div className="column-atribute">
        <p className="car-info">
          <FontAwesomeIcon icon={faCar} /> An: {car.an}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faCog} /> Cutia: {car.cutia === 0
            ? "Manual"
            : car.cutia === 1
            ? "Automat"
            : "Unspecified"}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faGasPump} /> Motor: {car.motor === 0
            ? "Diesel"
            : car.motor === 1
            ? "Hybrid"
            : car.motor === 2
            ? "Petrol"
            : car.motor === 3
            ? "Electric"
            : car.motor === 4
            ? "Petrol-Hybrid"
            : car.motor === 5
            ? "Petrol-Gaz"
            : "Unspecified"}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faCog} /> Capacitate cilindrică: {car.capacitate_cilindrica}
        </p>
      </div>
      <div className="column-atribute">
        <p className="car-info">
          <FontAwesomeIcon icon={faCar} /> Numar usi: {car.numar_usi === 0
            ? "3"
            : car.numar_usi === 1
            ? "5"
            : "Unspecified"}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faUsers} /> Numar Pasageri: {car.numar_pasageri === 0
            ? "2"
            : car.numar_pasageri === 1
            ? "4"
            : car.numar_pasageri === 2
            ? "5"
            : car.numar_pasageri === 3
            ? "7"
            : "Unspecified"}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faTachometerAlt} /> Limita de KM: {car.Limita_de_KM}
        </p>
        <p className="caroserie">
          <FontAwesomeIcon icon={faCarSide} /> Tip Caroserie: {car.caroserie === 0
            ? "Van"
            : car.caroserie === 1
            ? "Universal"
            : car.caroserie === 2
            ? "Minivan"
            : car.caroserie === 3
            ? "Roadster"
            : car.caroserie === 4
            ? "SUV"
            : car.caroserie === 5
            ? "Cabriolet"
            : car.caroserie === 6
            ? "Microvan"
            : car.caroserie === 7
            ? "Pickup"
            : car.caroserie === 8
            ? "Sedan"
            : car.caroserie === 9
            ? "Crossover"
            : car.caroserie === 10
            ? "Hatchback"
            : car.caroserie === 11
            ? "Combi"
            : car.caroserie === 12
            ? "Coupe"
            : "Unspecified"}
        </p>
      </div>
    </div>
          <p className="car-description">{car.descriere}</p>
      </div>
    </div>
        <div>
            <AddComment productId={id} />
        </div>
          <div>
            <ProductComments productId={id} />
        </div>
          </div>

  );
};


export default CarDetail;
