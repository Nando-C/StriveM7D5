import { useRef } from "react";
import { Card, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectSong,
  setCurrentTime,
  setDuration,
  setIsPlaying,
} from "../../../redux/slices/currentSong";
import "./AlbumCard.css";

const AlbumCard = (props) => {
  const isPlaying = useSelector((state) => state.currentSong.isPlaying);
  const track = useSelector((state) => state.currentSong.track);

  const dispatch = useDispatch();

  const togglePlayPause = (id) => {
    if (track.album?.id !== id) {
      dispatch(selectSong(props));
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  return (
    <Col className="AlbumCard">
      <Card>
        <Card.Body>
          <div className="img-container">
            <Link
              to={
                "/Album/" +
                (props.source === "home"
                  ? props.album.album.id
                  : props.album.id)
              }
            >
              <Card.Img
                src={props.album.cover_big || props.album.album.cover_big}
              />
            </Link>
            <div
              className="play-btn"
              onClick={() => togglePlayPause(props.album.id)}
              style={{
                opacity:
                  isPlaying && track.album?.id === props.album.id ? 1 : "",
              }}
            >
              <svg
                height="16"
                role="img"
                width="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                {isPlaying && track.album?.id === props.album.id ? (
                  <path fill="white" d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
                ) : (
                  <path fill="white" d="M4.018 14L14.41 8 4.018 2z"></path>
                )}
                {/* <polygon
                  points="21.57 12 5.98 3 5.98 21 21.57 12"
                  fill="white"
                ></polygon> */}
              </svg>
            </div>
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
