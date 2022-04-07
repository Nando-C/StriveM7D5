import { useEffect } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectSong, setIsPlaying } from "../../../redux/slices/currentSong";
import {
  fetchAlbums,
  fetchArtist,
  fetchArtistTopTracks,
} from "../../../redux/slices/selectedArtist";
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
  // =======================================================
  const isPlaying = useSelector((state) => state.currentSong.isPlaying);
  const track = useSelector((state) => state.currentSong.track);
  const firstSong = useSelector(
    (state) => state.selectedArtist.topTrackList?.topTracks[0]
  );
  console.log("Popular: ", firstSong);
  // =======================================================

  useEffect(() => {
    if (parseInt(artistId) !== artistSelected.id) {
      dispatch(fetchArtist(artistId));
      dispatch(fetchAlbums(artistId));
      dispatch(fetchArtistTopTracks(artistId));
    }
  }, [artistId]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlayPause = () => {
    if (track.artist.id !== artistSelected.id) {
      dispatch(selectSong(firstSong));
    }
    dispatch(setIsPlaying(!isPlaying));
  };

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
              <Col className="play-btn" onClick={togglePlayPause}>
                <svg
                  height="32"
                  role="img"
                  width="32"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  {isPlaying && track.artist.id === artistSelected.id ? (
                    <path fill="white" d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
                  ) : (
                    <path fill="white" d="M4.018 14L14.41 8 4.018 2z"></path>
                  )}
                  {/* <polygon
                    points="21.57 12 5.98 3 5.98 21 21.57 12"
                    fill="currentColor"
                  ></polygon> */}
                </svg>
              </Col>
              <Col className="follow-btn">FOLLOW</Col>
              <Col className="ellipsis-btn">
                <svg role="img" height="32" width="32" viewBox="0 0 32 32">
                  <path d="M5.998 13.999A2 2 0 105.999 18a2 2 0 00-.001-4zm10.001 0A2 2 0 1016 18a2 2 0 000-4zm10.001 0A2 2 0 1026.001 18 2 2 0 0026 14z"></path>
                </svg>
              </Col>
            </Row>
            <Popular />
            <Albums />
          </Row>
        </>
      )}
    </Container>
  );
};

export default Artist;
