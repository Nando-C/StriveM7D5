import { Row } from "react-bootstrap";
import { useGetArtistAlbumsQuery } from "../../../redux/api/deezerApi";
import AlbumCard from "../AlbumCard/AlbumCard";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import "./Albums.css";

const Albums = ({ artistId }) => {
  const {
    data: albumList,
    isLoading,
    isError,
    refetch,
  } = useGetArtistAlbumsQuery(artistId);

  return (
    <>
      <Row className="Albums mx-0">
        <h2>Albums</h2>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6">
          {isLoading && <h2 className="p-4">Loading...</h2>}
          {isError && <ErrorMessage onRetry={refetch} />}
          {albumList?.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </Row>
      </Row>
    </>
  );
};

export default Albums;
