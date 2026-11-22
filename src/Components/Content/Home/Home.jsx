import { Container } from "react-bootstrap";
import { usePageTitle } from "../../../utils/pageTitle";
import AlbumDeck from "../../AlbumDeck";
import "./Home.css";

const Home = () => {
  usePageTitle();

  return (
    <>
      <Container fluid className="Home m-0">
        <AlbumDeck />
      </Container>
    </>
  );
};

export default Home;
