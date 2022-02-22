import { useSelector } from "react-redux";
import { selectAllAlbums } from "../redux/slices/albumList";
import { Row } from "react-bootstrap";
import AlbumCard from "./Content/AlbumCard/AlbumCard";

const AlbumDeck = () => {
  const albums = useSelector(selectAllAlbums);

  const albumStatus = useSelector((state) => state.albums.status);
  const error = useSelector((state) => state.albums.error);

  console.log("From Redux: ", albums);

  return (
    <div id="cardsDeck">
      <Row id="deckHeader">
        <h3 className="pl-3 mt-4">Recomended for today</h3>
      </Row>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 pb-5">
        {albumStatus === "loading" && <h1>Loading...</h1>}
        {error && <h1>There was an error retrieving the information</h1>}
        {albums.lenght === 0 && albumStatus === "succeded" ? (
          <h2>We dont have this album collection</h2>
        ) : (
          albums.map((album) => (
            <AlbumCard key={album.id} album={album} source="home" />
          ))
        )}
      </Row>
    </div>
  );
};

export default AlbumDeck;
