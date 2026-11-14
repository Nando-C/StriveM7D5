import { Row } from "react-bootstrap";
import { useGetHomeTracksQuery } from "../redux/api/deezerApi";
import AlbumCard from "./Content/AlbumCard/AlbumCard";

const AlbumDeck = () => {
  const {
    data: trackList = [],
    isLoading,
    isError,
    isSuccess,
  } = useGetHomeTracksQuery();

  return (
    <>
      {isLoading && <h2 className="p-4">Loading...</h2>}
      {isError && (
        <h1 className="p-4">There was an error retrieving the information</h1>
      )}
      {trackList.length === 0 && isSuccess && (
        <h2>We dont have this album collection</h2>
      )}
      {isSuccess && (
        <div id="cardsDeck">
          <Row id="deckHeader">
            <h3 className="pl-3 mt-4">Recomended for today</h3>
          </Row>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 pb-5">
            {trackList.map((album) => (
              <AlbumCard key={album.id} album={album} source="home" />
            ))}
          </Row>
        </div>
      )}
    </>
  );
};

export default AlbumDeck;
