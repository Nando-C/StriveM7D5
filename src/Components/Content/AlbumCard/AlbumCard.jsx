import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AlbumCard.css";

const AlbumCard = (props) => {
  return (
    <Col className="AlbumCard">
      <Card>
        <Card.Body>
          <Link to={"/Album/" + (props.album.id || props.album.album.id)}>
            <Card.Img
              fluid
              src={props.album.cover_medium || props.album.album.cover_medium}
            />
          </Link>
          <Link to={"/Album/" + (props.album.id || props.album.album.id)}>
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
