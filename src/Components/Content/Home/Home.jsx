import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchHomeTrackList } from "../../../redux/slices/home";
import AlbumDeck from "../../AlbumDeck";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();

  const trackListStatus = useSelector((state) => state.home.status);

  useEffect(() => {
    if (trackListStatus === "idle") {
      dispatch(fetchHomeTrackList());
    }
  }, [trackListStatus, dispatch]);

  return (
    <>
      <Container fluid className="Home m-0">
        <AlbumDeck />
      </Container>
    </>
  );
};

export default Home;
