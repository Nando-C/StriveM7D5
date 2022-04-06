import { Card, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectSong, setIsPlaying } from "../../../redux/slices/currentSong";
import "./AlbumCard.css";

const AlbumCard = (props) => {
  const isPlaying = useSelector((state) => state.currentSong.isPlaying);
  const dispatch = useDispatch();

  const playSong = () => {
    dispatch(selectSong(props));
    // dispatch(dispatch(setIsPlaying(!isPlaying)));
  };

  return (
    <Col className="AlbumCard">
      <Card>
        <Card.Body>
          <Link
            to={
              "/Album/" +
              (props.source === "home" ? props.album.album.id : props.album.id)
            }
          >
            <div className="img-container">
              <Card.Img
                src={props.album.cover_big || props.album.album.cover_big}
              />
              <div className="play-btn" onClick={playSong}>
                <svg
                  height="16"
                  role="img"
                  width="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <polygon
                    points="21.57 12 5.98 3 5.98 21 21.57 12"
                    fill="white"
                  ></polygon>
                </svg>
              </div>
            </div>
          </Link>
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
