    import React, { useState, useEffect } from "react";
    import { Link } from "react-router-dom";
    import { Container, Image, Spinner } from "react-bootstrap";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import {
      faCar,
      faCog,
      faGasPump,
      faArrowRight,
      faArrowLeft,
    } from "@fortawesome/free-solid-svg-icons";
    import "../../styles/produs/Car.css";
    import "../../styles/produs/Filtre.css";



    const ProductList = () => {
      const [products, setProducts] = useState([]);
      const [selectedProduct, setSelectedProduct] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [currentPage, setCurrentPage] = useState(1);
      const productsPerPage = 12;

      const [producers, setProducers] = useState([]);
      const [motorOptions, setMotorOptions] = useState([]);
      const [cutiaOptions, setCutiaOptions] = useState([]);
      const [usiOptions, setUsiOptions] = useState([]);
      const [pasageriOptions, setPasageriOptions] = useState([]);
      const [caroserieOptions, setCaroserieOptions] = useState([]);
      const [yearRange, setYearRange] = useState({ min: '', max: '' });
      const [capacityRange, setCapacityRange] = useState({ min: '', max: '' });


      const [filters, setFilters] = useState({
        producator: "",
        cutia: "",
        motor: "",
      });

      useEffect(() => {
      fetch("http://localhost:8000/api/produs/car")
        .then((response) => response.json())
        .then((data) => {
          const uniqueProducers = [
            ...new Set(data.map((product) => product.producator)),
          ];
          setProducers(uniqueProducers);

          const uniqueCutiaOptions = [
            ...new Set(data.map((product) => product.cutia)),
          ];
          setCutiaOptions(uniqueCutiaOptions);

          const uniqueMotorOptions = [
            ...new Set(data.map((product) => product.motor)),
          ];
          setMotorOptions(uniqueMotorOptions);
          const uniqueUsiOptions = [
            ...new Set(data.map((product) => product.numar_usi)),
          ];
          setUsiOptions(uniqueUsiOptions);

          const uniquePasageriOptions = [
            ...new Set(data.map((product) => product.numar_pasageri)),
          ];
          setPasageriOptions(uniquePasageriOptions);

          const uniqueCaroserieOptions = [
            ...new Set(data.map((product) => product.caroserie)),
          ];
          setCaroserieOptions(uniqueCaroserieOptions);

          const years = data.map((product) => product.an);
            const uniqueYears = [...new Set(years)];

            const sortedUniqueYears = uniqueYears.sort((a, b) => a - b);

            const defaultMinYear = sortedUniqueYears[0];
            const defaultMaxYear = sortedUniqueYears[sortedUniqueYears.length - 1];
            setYearRange({ min: defaultMinYear, max: defaultMaxYear });

            const uniqueCapacityOptions = data.reduce((acc, product) => {
                if (acc.min === '' || product.capacitate_cilindrica < acc.min) {
                    acc.min = product.capacitate_cilindrica;
            }
                if (acc.max === '' || product.capacitate_cilindrica > acc.max) {
                    acc.max = product.capacitate_cilindrica;
            }
                return acc;
            }, { min: '', max: '' });

            setCapacityRange(uniqueCapacityOptions);
            setYearRange({ min: '', max: '' });
            setCapacityRange({ min: '', max: '' });


          setProducts(data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching products");
          setLoading(false);
        });
    }, []);

      useEffect(() => {

      }, [filters, yearRange, capacityRange]);

      const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters({
          ...filters,
          [name]: value,
        });
      };

       const handleFilterApplyClick = (e) => {
            e.preventDefault();
  setLoading(true);

  const queryParams = new URLSearchParams({
    ...filters,
    an_min: yearRange.min,
    an_max: yearRange.max,
    capacitate_cilindrica_min: capacityRange.min,
    capacitate_cilindrica_max: capacityRange.max,
  }).toString();

  fetch(`http://localhost:8000/api/produs/filter/?${queryParams}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setProducts(data);
      setLoading(false);
    })
    .catch((error) => {
      setError("Error fetching filtered products");
      setLoading(false);
    });
};

      const handleProductClick = (product) => {
        setSelectedProduct(product);
      };

      if (loading) {
        return <Spinner animation="border" />;
      }

      if (error) {
        return <div>Error: {error}</div>;
      }

      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      const currentProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct
      );

      const pages = Math.ceil(products.length / productsPerPage);
      const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

      return (
        <Container>


            <div className="car-filters">
                <div className="filters">
            <select
                className="personalizare"
              name="producator"
              value={filters.producator}
              onChange={handleFilterChange}
            >
              <option value="">Producător</option>
              {producers.map((producer, index) => (
                <option key={index} value={producer}>
                  {producer}
                </option>
              ))}
            </select>

            <select
                className="personalizare"
      name="cutia"
      value={filters.cutia}
      onChange={handleFilterChange}
    >
      <option value=""> Cutii</option>
      {cutiaOptions.map((cutia, index) => (
        <option key={index} value={cutia}>
          {cutia === 0
            ? "Manual"
            : cutia === 1
            ? "Automat"
            : "Nespecificat"}
        </option>
      ))}
    </select>

    <select
        className="personalizare"
      name="motor"
      value={filters.motor}
      onChange={handleFilterChange}
    >
      <option value="">Motor</option>
      {motorOptions.map((motor, index) => (
        <option key={index} value={motor}>
          {motor === 0
            ? "Diesel"
            : motor === 1
            ? "Hybrid"
            : motor === 2
            ? "Petrol"
            : motor === 3
            ? "Electric"
            : motor === 4
            ? "Petrol-Hybrid"
            : motor === 5
            ? "Petrol-Gaz"
            : "Nespecificat"}
        </option>
      ))}
        </select>
    <select
        className="personalizare"
      name="numar_usi"
      value={filters.numar_usi}
      onChange={handleFilterChange}
    >
      <option value="">Numerele de Uși</option>
      {usiOptions.map((usi, index) => (
        <option key={index} value={usi}>
          {usi === 0
            ? "3"
            : usi === 1
            ? "5"
            : "Nespecificat"}
        </option>
      ))}
    </select>

    <select
        className="personalizare"
      name="numar_pasageri"
      value={filters.numar_pasageri}
      onChange={handleFilterChange}
    >
      <option value="">Numerele de Pasageri</option>
      {pasageriOptions.map((pasageri, index) => (
        <option key={index} value={pasageri}>
          {pasageri === 0
            ? "2"
            : pasageri === 1
            ? "4"
            : pasageri === 2
            ? "5"
            : pasageri === 3
            ? "7"
            : "Nespecificat"}
        </option>
      ))}
    </select>

    <select
        className="personalizare"
      name="caroserie"
      value={filters.caroserie}
      onChange={handleFilterChange}
    >
      <option value="">Caroserie</option>
      {caroserieOptions.map((caroserie, index) => (
        <option key={index} value={caroserie}>
          {caroserie === 0
            ? "Van"
            : caroserie === 1
            ? "Universal"
            : caroserie === 2
            ? "Minivan"
            : caroserie === 3
            ? "Roadster"
            : caroserie === 4
            ? "SUV"
            : caroserie === 5
            ? "Cabriolet"
            : caroserie === 6
            ? "Microvan"
            : caroserie === 7
            ? "Pickup"
            : caroserie === 8
            ? "Sedan"
            : caroserie === 9
            ? "Crossover"
            : caroserie === 10
            ? "Hatchback"
            : caroserie === 11
            ? "Combi"
            : caroserie === 12
            ? "Coupe"
            : "Nespecificat"}
        </option>
      ))}
    </select>
    <div className="input-with-dash">
  <input
    className="personalizare-input"
    type="number"
    name="anMin"
    placeholder="An de la"
    value={yearRange.min}
    onChange={(e) =>
      setYearRange({ ...yearRange, min: e.target.value })
    }
    onBlur={(e) =>
      setYearRange({
        ...yearRange,
        min: e.target.value === '' ? '' : parseInt(e.target.value),
      })
    }
  />
  <div className="dash">-</div>
  <input
    className="personalizare-input"
    type="number"
    name="anMax"
    placeholder="An până la"
    value={yearRange.max}
    onChange={(e) =>
      setYearRange({ ...yearRange, max: e.target.value })
    }
    onBlur={(e) =>
      setYearRange({
        ...yearRange,
        max: e.target.value === '' ? '' : parseInt(e.target.value),
      })
    }
  />
</div>

<div className="input-with-dash">
  <input
    className="personalizare-input"
    type="number"
    name="capacitate_cilindrica_min"
    placeholder="Capacitate de la"
    value={capacityRange.min}
    onChange={(e) =>
      setCapacityRange({ ...capacityRange, min: e.target.value })
    }
    onBlur={(e) =>
      setCapacityRange({
        ...capacityRange,
        min: e.target.value === '' ? '' : parseInt(e.target.value),
      })
    }
  />
  <div className="dash">-</div>
  <input
    className="personalizare-input"
    type="number"
    name="capacitate_cilindrica_max"
    placeholder="Capacitate până la"
    value={capacityRange.max}
    onChange={(e) =>
      setCapacityRange({ ...capacityRange, max: e.target.value })
    }
    onBlur={(e) =>
      setCapacityRange({
        ...capacityRange,
        max: e.target.value === '' ? '' : parseInt(e.target.value),
      })
    }
  />
</div>


          </div >
                <div className={"filter-buton"}>
                  <button className={"personalizare-buton"} onClick={handleFilterApplyClick}>Aplică filtrele</button>
                </div>
            </div>


          <div className="product-list">
            {currentProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <div
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  {product.images.length > 0 && (
                    <Image
                      src={product.images[0].image}
                      fluid
                      className="product-image"
                    />
                  )}
                  <div className="product-details">
                    <p className="product-name-car">
                      {product.producator} {product.name}
                    </p>
                    <p className="product-price">
                      De la <span className="price-number">{product.price1} €</span>
                      / Zi
                    </p>
                    <p className="product-info">
                      <FontAwesomeIcon
                        icon={faCar}
                        style={{ color: "red", fontSize: "18px" }}
                      />{" "}
                      An: {product.an}{" "}
                      <FontAwesomeIcon
                        icon={faCog}
                        style={{ color: "red", fontSize: "18px" }}
                      />{" "}
                      {product.cutia === 0
                        ? "Manual"
                        : product.cutia === 1
                        ? "Automat"
                        : "Unspecified"}{" "}
                      <FontAwesomeIcon
                        icon={faGasPump}
                        style={{ color: "red", fontSize: "18px" }}
                      />{" "}
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
                  className={currentPage === number ? "active" : ""}
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
