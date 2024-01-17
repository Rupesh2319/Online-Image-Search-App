import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import "./index.css";
const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handelSearch = (event) => {
    event.preventDefault();
    console.log(searchInput.current.value);
    setPage(1);
    fetchImages();
  };

  const handelSelection = (selection) => {
    searchInput.current.value = selection;
    setPage(1);

    fetchImages();
  };
  useEffect(() => {
    fetchImages();
  }, [page]);

  const fetchImages = async () => {
    try {
      if (searchInput.current.value) {
        // setErrorMsg("");
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        console.log("data", data);

        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    } catch (error) {
    
    setLoading(false);
    console.log(error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Image Search</h1>
      <div className="search-section">
        <Form onSubmit={handelSearch}>
          <Form.Control
            type="search"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handelSelection("birds")}>Birds</div>
        <div onClick={() => handelSelection("Nature")}>Nature</div>
        <div onClick={() => handelSelection("Animal")}>Animal</div>
        <div onClick={() => handelSelection("shoes")}>shoes</div>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="images">
            {images.map((image) => {
              return (
                <img
                  key={image.id}
                  src={image.urls.small}
                  alt={image.alt_description}
                  className="image"
                />
              );
            })}
          </div>
          <div className="buttons">
            {page > 1 && (
              <Button onClick={() => setPage(page - 1)}>Previous</Button>
            )}
            {page < totalPages && (
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
