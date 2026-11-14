import { Container } from "react-bootstrap";
import AlbumDeck from "../../AlbumDeck";
import "./Home.css";

const Home = () => {
  return (
    <>
      <Container fluid className="Home m-0">
        <AlbumDeck />
      </Container>
    </>
  );
};

export default Home;
