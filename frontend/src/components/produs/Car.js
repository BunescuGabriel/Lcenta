import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { Container, Card, Image, Spinner } from "react-bootstrap";
import '../../styles/produs/Car.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCog } from "@fortawesome/free-solid-svg-icons";
import { faGasPump } from "@fortawesome/free-solid-svg-icons";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/produs/car")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching products");
        setLoading(false);
      });
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <h2>Lista de Produse</h2>
      <div className="product-list">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <Card style={{ cursor: "pointer" }} onClick={() => handleProductClick(product)} className="product-card">
              <Card.Body>
                {product.images.length > 0 && (
                  <Image src={product.images[0].image} fluid />
                )}
                <Card.Title>
                  {product.producator} {product.name}
                </Card.Title>
                <Card.Title>De la pretul €/Zi</Card.Title>
                <Card.Title>
                  <FontAwesomeIcon icon={faCar} /> An: {product.an}{" "}
                  <FontAwesomeIcon icon={faCog} />{" "}
                  {product.cutia === 0
                    ? "Manual"
                    : product.cutia === 1
                    ? "Automat"
                    : "Unspecified"}{" "}
                  <FontAwesomeIcon icon={faGasPump} />{" "}
                  {product.motor === 0
                    ? "Diesel"
                    : product.motor === 1
                    ? "Hybrid"
                    : product.motor === 2
                    ? "Petrol"
                    : product.motor === 3
                    ? "Electric"
                    : product.motor === 4
                    ? "Petrol-Hybrid"
                    : product.motor === 5
                    ? "Petrol-Gaz"
                    : "Unspecified"}
                </Card.Title>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default ProductList;
