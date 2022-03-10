import { useSelector } from "react-redux";
import { selectAllAlbums } from "../redux/slices/home";
import { Row } from "react-bootstrap";
import AlbumCard from "./Content/AlbumCard/AlbumCard";

const AlbumDeck = () => {
  const albums = useSelector(selectAllAlbums);

  const albumStatus = useSelector((state) => state.home.status);
  const error = useSelector((state) => state.home.error);

  console.log("From Redux: ", albums);

  return (
    <>
      {albumStatus === "loading" && <h2 className="p-4">Loading...</h2>}
      {error && (
        <h1 className="p-4">There was an error retrieving the information</h1>
      )}
      {albums.lenght === 0 && albumStatus === "succeded" && (
        <h2>We dont have this album collection</h2>
      )}
      {albumStatus === "succeded" && (
        <div id="cardsDeck">
          <Row id="deckHeader">
            <h3 className="pl-3 mt-4">Recomended for today</h3>
          </Row>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 pb-5">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} source="home" />
            ))}
          </Row>
        </div>
      )}
    </>
  );
};

export default AlbumDeck;
