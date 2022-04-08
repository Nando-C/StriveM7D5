import { Col, Container, Row } from "react-bootstrap";
import NowPlaying from "./NowPlaying/NowPlaying";
import PlayerControls from "./PlayerControls/PlayerControls";
import Volume from "./Volume/Volume";
import "./Player.css";
import { useSelector } from "react-redux";

const Player = () => {
  const currentSong = useSelector((state) => state.currentSong.track);
  return (
    <Container className="Player" fluid>
      <Row className="px-3 h-100 align-items-center">
        <Col xs={6} sm={4} lg={3}>
          {currentSong.album?.id && <NowPlaying />}
        </Col>
        <Col xs={6} sm={5} lg={6}>
          <PlayerControls />
        </Col>
        <Col sm={3} lg={3} className="d-none d-sm-block">
          <Volume />
        </Col>
      </Row>
    </Container>
  );
};

export default Player;
