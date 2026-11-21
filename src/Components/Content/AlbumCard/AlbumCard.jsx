import { Card, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { playOrToggle } from "../../../utils/playback";
import "./AlbumCard.css";

const AlbumCard = (props) => {
  const isPlaying = useSelector((state) => state.currentSong.isPlaying);
  const track = useSelector((state) => state.currentSong.track);

  const dispatch = useDispatch();

  const togglePlayPause = (id) =>
    playOrToggle(dispatch, {
      isSameTrack: track.id === id,
      isPlaying,
      track: props.album,
    });

  return (
    <Col className="AlbumCard">
      <Card>
        <Card.Body>
          <div className="img-container">
            {/* The title below links to the same album, so this link is
                kept out of the tab order and away from screen readers. */}
            <Link
              to={
                "/Album/" +
                (props.source === "home"
                  ? props.album.album.id
                  : props.album.id)
              }
              aria-hidden="true"
              tabIndex={-1}
            >
              <Card.Img
                src={props.album.cover_big || props.album.album.cover_big}
                alt=""
              />
            </Link>
            {/* Only a track can be played: on the artist page the card
                shows an album, which has nothing to play. */}
            {props.source === "home" && (
              <button
                type="button"
                className="play-btn icon-btn"
                aria-label={`${
                  isPlaying && track.id === props.album.id ? "Pause" : "Play"
                } ${props.album.title}`}
                onClick={() => togglePlayPause(props.album.id)}
                style={{
                  opacity:
                    isPlaying && track.id === props.album.id ? 1 : undefined,
                }}
              >
                <svg
                  aria-hidden="true"
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                >
                  {isPlaying && track.id === props.album.id ? (
                    <path fill="white" d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
                  ) : (
                    <path fill="white" d="M4.018 14L14.41 8 4.018 2z"></path>
                  )}
                  {/* <polygon
                  points="21.57 12 5.98 3 5.98 21 21.57 12"
                  fill="white"
                ></polygon> */}
                </svg>
              </button>
            )}
          </div>
          <Link
            to={
              "/Album/" +
              (props.source === "home" ? props.album.album.id : props.album.id)
            }
          >
            <Card.Title>
              {props.album.title || props.album.album.title}
            </Card.Title>
          </Link>
          {props.album.artist && (
            <Link to={"/Artist/" + props.album.artist.id}>
              <Card.Subtitle>{props.album.artist.name}</Card.Subtitle>
            </Link>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AlbumCard;
