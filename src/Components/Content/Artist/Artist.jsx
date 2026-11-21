import { Col, Container, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { playOrToggle } from "../../../utils/playback";
import {
  useGetArtistAlbumsQuery,
  useGetArtistQuery,
  useGetArtistTopTracksQuery,
} from "../../../redux/api/deezerApi";
import Albums from "../Albums/Albums";
import Popular from "../Popular/Popular";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import "./Artist.css";

const Artist = () => {
  const { artistId } = useParams();

  const dispatch = useDispatch();
  const {
    data: artistSelected,
    isLoading,
    isError,
    refetch,
  } = useGetArtistQuery(artistId);
  const { data: topTracks } = useGetArtistTopTracksQuery(artistId);
  // Not read here: `Albums` shows them. Asking now starts the request with
  // the other two, where `Albums` only mounts once the artist has arrived.
  useGetArtistAlbumsQuery(artistId);

  const isPlaying = useSelector((state) => state.currentSong.isPlaying);
  const track = useSelector((state) => state.currentSong.track);
  const firstSong = topTracks?.[0];

  // No track is loaded on a fresh page, so `track.artist` may be undefined.
  const isThisArtistLoaded =
    artistSelected !== undefined && track.artist?.id === artistSelected.id;

  const togglePlayPause = () =>
    playOrToggle(dispatch, {
      isSameTrack: isThisArtistLoaded,
      isPlaying,
      track: firstSong,
    });

  return (
    <Container fluid className="Artist">
      {isLoading && <h2 className="p-4">Loading...</h2>}
      {isError && <ErrorMessage onRetry={refetch} />}
      {artistSelected && (
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
                  {isPlaying && isThisArtistLoaded ? (
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
            <Popular artistId={artistId} />
            <Albums artistId={artistId} />
          </Row>
        </>
      )}
    </Container>
  );
};

export default Artist;
