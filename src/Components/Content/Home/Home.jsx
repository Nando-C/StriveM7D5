import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchAlbums } from "../../../redux/slices/home";
// import CardsDeck from "../../CardsDeck";
import AlbumDeck from "../../AlbumDeck";
import "./Home.css";

const Home = () => {
  // ============== Testing Redux
  const dispatch = useDispatch();

  const albumStatus = useSelector((state) => state.home.status);

  useEffect(() => {
    if (albumStatus === "idle") {
      dispatch(fetchAlbums());
    }
  }, [albumStatus, dispatch]);
  // ==============

  return (
    <>
      <Container fluid className="Home m-0">
        <AlbumDeck />
      </Container>
    </>
  );
};

export default Home;
