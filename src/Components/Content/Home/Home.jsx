import { Container } from "react-bootstrap";
import CardsDeck from "../../CardsDeck";
import "./Home.css";

const Home = () => {
  return (
    <>
      <Container fluid className="Home m-0">
        <CardsDeck />
      </Container>
    </>
  );
};

export default Home;
