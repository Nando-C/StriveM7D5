import { Component } from "react";
import { Col, Container } from "react-bootstrap";
import CardsDeck from "../../CardsDeck";
import Navbar from "../../NavBar";

class Home extends Component {
  state = {};
  render() {
    return (
      <>
        <Container fluid className=" m-0" id="contentHome">
          <Navbar />
          <CardsDeck />
        </Container>
      </>
    );
  }
}

export default Home;
