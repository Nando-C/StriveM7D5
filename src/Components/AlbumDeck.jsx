import { Row } from "react-bootstrap";
import { useGetHomeTracksQuery } from "../redux/api/deezerApi";
import AlbumCard from "./Content/AlbumCard/AlbumCard";
import ErrorMessage from "./ErrorMessage/ErrorMessage";

// The covers on screen when the page opens load at once; the rest load as
// they are scrolled to.
const EAGER_COVERS = 6;

const AlbumDeck = () => {
  const {
    data: trackList = [],
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetHomeTracksQuery();

  return (
    <>
      {isLoading && <h2 className="p-4">Loading...</h2>}
      {isError && <ErrorMessage onRetry={refetch} />}
      {isSuccess && trackList.length === 0 && (
        <h2 className="p-4">We don't have this album collection</h2>
      )}
      {isSuccess && trackList.length > 0 && (
        <div id="cardsDeck">
          <Row id="deckHeader">
            <h3 className="mt-4">Recommended for today</h3>
          </Row>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 pb-5">
            {trackList.map((album, i) => (
              <AlbumCard
                key={album.id}
                album={album}
                source="home"
                eager={i < EAGER_COVERS}
              />
            ))}
          </Row>
        </div>
      )}
    </>
  );
};

export default AlbumDeck;
