import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCog } from "@fortawesome/free-solid-svg-icons";
import { faGasPump } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight,faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import '../../styles/produs/Car.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const pages = Math.ceil(products.length / productsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Container>
      <div className="product-list">
        {currentProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <div
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              {product.images.length > 0 && (
                <Image src={product.images[0].image} fluid className="product-image" />
              )}
              <div className="product-details">
                <p className="product-name-car" style={{ textDecoration: 'none' }}>
                  {product.producator} {product.name}
                </p>
                <p className="product-price">De la <span className="price-number">{product.price1} €</span>/ Zi</p>
                <p className="product-info">
                  <FontAwesomeIcon icon={faCar} style={{ color: 'red', fontSize: '18px' }} /> An: {product.an}{" "}
                  <FontAwesomeIcon icon={faCog} style={{ color: 'red', fontSize: '18px' }} />{" "}
                  {product.cutia === 0
                    ? "Manual"
                    : product.cutia === 1
                      ? "Automat"
                      : "Unspecified"}{" "}
                  <FontAwesomeIcon icon={faGasPump} style={{ color: 'red', fontSize: '18px' }} />{" "}
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
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          </button>

        )}

        <ul className="page-numbers">
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={currentPage === number ? 'active' : ''}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </li>
          ))}
        </ul>

        {products.length > indexOfLastProduct && (

            <button onClick={() => setCurrentPage(currentPage + 1)}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </div>
    </Container>
  );
};

export default ProductList;
