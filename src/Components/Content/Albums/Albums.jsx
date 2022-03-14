import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import AlbumCard from "../AlbumCard/AlbumCard";
import "./Albums.css";

const Albums = () => {
  const albumStatus = useSelector(
    (state) => state.selectedArtist.albumList.status
  );
  const albumList = useSelector(
    (state) => state.selectedArtist.albumList.albums
  );

  return (
    <>
      <Row className="Albums mx-0">
        <h2>Albums</h2>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6">
          {albumStatus === "loading" && <h2 className="p-4">Loading...</h2>}
          {albumStatus === "failed" && (
            <h1 className="p-4">
              There was an error retrieving the information
            </h1>
          )}
          {albumStatus === "succeded" &&
            albumList.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
        </Row>
      </Row>
    </>
  );
};

export default Albums;
