import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchAlbums, selectAllAlbums } from "../../../redux/slices/albumList";
import CardsDeck from "../../CardsDeck";
import "./Home.css";

const Home = () => {
  // ============== Testing Redux
  const dispatch = useDispatch();
  const albumStatus = useSelector((state) => state.albums.status);
  const albums = useSelector(selectAllAlbums);
  console.log("From Redux: ", albums);

  useEffect(() => {
    if (albumStatus === "idle") {
      dispatch(fetchAlbums());
    }
  }, [albumStatus, dispatch]);
  // ==============
  return (
    <>
      <Container fluid className="Home m-0">
        <CardsDeck />
      </Container>
    </>
  );
};

export default Home;
