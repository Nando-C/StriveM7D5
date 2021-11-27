import { Col, Container, Row } from "react-bootstrap";
import NowPlaying from "./NowPlaying/NowPlaying";
import PlayerControls from "./PlayerControls/PlayerControls";
import Volume from "./Volume/Volume";
import "./Player.css";

const Player = () => {
  return (
    <Container className="Player" fluid>
      <Row className="px-3 h-100 align-items-center">
        <Col>
          <NowPlaying />
        </Col>
        <Col>
          <PlayerControls />
        </Col>
        <Col className="d-none d-sm-block">
          <Volume />
        </Col>
      </Row>
    </Container>
  );
};

export default Player;
