import { Container } from "react-bootstrap";
import CardsDeck from "../../CardsDeck";
import Navbar from "../../NavBar";
import "./Home.css";

const Home = () => {
  return (
    <>
      <Container fluid className="Home m-0">
        {/* <Navbar /> */}
        <CardsDeck />
      </Container>
    </>
  );
};

export default Home;
