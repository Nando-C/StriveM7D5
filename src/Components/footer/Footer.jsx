import { Component } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Play from "../play/Play";
import "./footer.css";

class Footer extends Component {
  state = {};
  render() {
    return (
      <>
        <footer>
          <Row className="mx-3 w-100">
            <Col className="p-0" sm={12} md={3}>
              {/* <NowPlaying /> */}
            </Col>
            <Col sm={12} md={6}>
              <Play />
            </Col>
            <Col sm={12} md={3}>
              {/* <Volume /> */}
            </Col>
          </Row>
        </footer>
      </>
    );
  }
}

export default Footer;
