import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import AlbumCard from "../Content/AlbumCard/AlbumCard";
import "./Search.css";

const Search = () => {
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const [query, setQuery] = useState("");
  const [albumInfo, setAlbumInfo] = useState({
    albumList: [],
    isLoading: true,
    isError: false,
  });

  const fetchAlbum = async (query = "i") => {
    try {
      const response = await fetch(`${baseURL}/search?q=${query}`);
      if (response.ok) {
        const albumResponse = await response.json();
        // console.log("albumResponse: ", albumResponse.data);
        setAlbumInfo({
          albumList: albumResponse.data,
          isLoading: false,
          isError: false,
        });
      } else {
        console.log("There was an error retrieving the information!");
        setAlbumInfo({
          isLoading: false,
          isError: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query === "") {
      fetchAlbum();
    } else {
      fetchAlbum(query);
    }
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container className="Search">
      <Row className="row-form">
        <Col sm={9} className="form-container">
          <Form>
            <Form.Control
              placeholder="Artists, songs, or podcasts"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-icon">
              <span>
                <svg
                  role="img"
                  height="24"
                  width="24"
                  // class="Svg-sc-1bi12j5-0 gSLhUO _pxQadHFO3vmadLs8OPr"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.387 16.623A8.47 8.47 0 0019 10.5a8.5 8.5 0 10-8.5 8.5 8.454 8.454 0 005.125-1.73l4.401 5.153.76-.649-4.399-5.151zM10.5 18C6.364 18 3 14.636 3 10.5S6.364 3 10.5 3 18 6.364 18 10.5 14.636 18 10.5 18z"></path>
                </svg>
              </span>
            </div>
          </Form>
        </Col>
      </Row>
      {albumInfo.isLoading && <h2 className="p-4">Loading...</h2>}
      {albumInfo.isError && (
        <h1 className="p-4">There was an error retrieving the information</h1>
      )}
      {!albumInfo.isLoading && !albumInfo.isError && (
        <>
          {query === "" && !albumInfo.isLoading && !albumInfo.isError && (
            <Row className="pt-3">
              <h2>Trending</h2>
            </Row>
          )}
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 py-4">
            {albumInfo.albumList.map((album) => (
              <AlbumCard key={album.id} album={album} source="home" />
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Search;
