import { Col, Container, Row } from "react-bootstrap";
import NowPlaying from "../NowPlaying/NowPlaying";
import PlayerControls from "../PlayerControls/PlayerControls";
import Volume from "../Volume/Volume";
import "./Player.css";

const Player = () => {
  return (
    <Container className="Player" fluid>
      <Row className="px-3 h-100 align-items-center">
        <Col>
          <NowPlaying />
        </Col>
        <Col>
          {/* <Row className="justify-content-center align-items-center h-100"> */}
          <PlayerControls />
          {/* </Row> */}
        </Col>
        <Col>
          <Row className="justify-content-center align-items-center h-100">
            <Volume />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Player;
