import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {faCar, faCog, faGasPump} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    // Replace this with your API call to fetch car details by ID
    fetch(`http://localhost:8000/api/produs/car/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCar(data);
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
      });
  }, [id]);

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Car Details</h2>
        <div className="image-gallery">
        {car.images.map((image, index) => (
          <img key={index} src={image.image} alt={`Image ${index}`} />
        ))}
      </div>

      <p>{car.producator} {car.name}</p>
      <p><FontAwesomeIcon icon={faCar} /> An: {car.an}</p>
      <p><FontAwesomeIcon icon={faCog} /> Cutia: {car.cutia === 0 ? "Manual"
          : car.motor === 1
          ? "Automat"
          : "Unspecified"}</p>
      <p><FontAwesomeIcon icon={faGasPump} /> Motor: {car.motor === 0
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
                    : "Unspecified"}</p>
        <p>Numar usi: {car.numar_usi === 0
                    ? "3"
                    : car.numar_usi === 1
                    ? "5"
                    : "Unspecified"}</p>
        <p>Numar Pasageri: {car.numar_pasageri === 0
                    ? "2"
                    : car.numar_pasageri === 1
                    ? "4"
                    : car.numar_pasageri === 2
                    ? "5"
                    : car.numar_pasageri === 3
                    ? "7"
                    : "Unspecified"}</p>
        <p>Limita de KM: {car.Limita_de_KM}</p>
        <p>{car.descriere}</p>
        <p>{car.capacitate_cilindrica}</p>
        <p>Tip Caroserie: {car.caroserie === 0
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
                    : "Unspecified"}</p>

    </div>
  );
};

export default CarDetail;
