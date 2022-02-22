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
  const albums = useSelector(selectAllAlbums);

  const albumStatus = useSelector((state) => state.albums.status);
  // const error = useSelector((state) => state.albums.error);

  useEffect(() => {
    if (albumStatus === "idle") {
      dispatch(fetchAlbums());
    }
  }, [albumStatus, dispatch]);

  console.log("From Redux: ", albums);
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
