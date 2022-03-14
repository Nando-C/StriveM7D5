import { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAlbums, fetchArtist } from "../../../redux/slices/selectedArtist";
import Albums from "../Albums/Albums";
import Popular from "../Popular/Popular";
import "./Artist.css";

const Artist = () => {
  const { artistId } = useParams();

  const dispatch = useDispatch();
  const artistStatus = useSelector(
    (state) => state.selectedArtist.artistInfo.status
  );

  const artistSelected = useSelector(
    (state) => state.selectedArtist.artistInfo.artist
  );

  useEffect(() => {
    if (parseInt(artistId) !== artistSelected.id) {
      dispatch(fetchArtist(artistId));
      dispatch(fetchAlbums(artistId));
    }
  }, [artistId]);

  return (
    <Container fluid className="Artist">
      {artistStatus === "loading" && <h2 className="p-4">Loading...</h2>}
      {artistStatus === "failed" && (
        <h1 className="p-4">There was an error retrieving the information</h1>
      )}
      {artistStatus === "succeded" && (
        <>
          <Row className="banner">
            <Image src={artistSelected.picture_xl} />
            <Row className="banner-text flex-column justify-content-end">
              <h1>{artistSelected.name}</h1>
              <h4>
                {artistSelected.nb_fan.toLocaleString()} Monthly Listeners
              </h4>
            </Row>
            <Row className="mid-bg-colour"></Row>
          </Row>
          <Row className="artist-content m-0 px-3">
            <Row xs="auto" className="options">
              <Col className="play-btn">
                <svg
                  height="32"
                  role="img"
                  width="32"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <polygon
                    points="21.57 12 5.98 3 5.98 21 21.57 12"
                    fill="currentColor"
                  ></polygon>
                </svg>
                {/* <svg
                    height="32"
                    role="img"
                    width="32"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="5"
                      y="3"
                      width="4"
                      height="18"
                      fill="currentColor"
                    ></rect>
                    <rect
                      x="15"
                      y="3"
                      width="4"
                      height="18"
                      fill="currentColor"
                    ></rect>
                  </svg> */}
              </Col>
              <Col className="follow-btn">FOLLOW</Col>
              <Col className="ellipsis-btn">
                <svg role="img" height="32" width="32" viewBox="0 0 32 32">
                  <path d="M5.998 13.999A2 2 0 105.999 18a2 2 0 00-.001-4zm10.001 0A2 2 0 1016 18a2 2 0 000-4zm10.001 0A2 2 0 1026.001 18 2 2 0 0026 14z"></path>
                </svg>
              </Col>
            </Row>
            <Popular artistId={artistId} />
            <Albums />
          </Row>
        </>
      )}
    </Container>
  );
};

export default Artist;
