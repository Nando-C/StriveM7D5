import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import AlbumCard from "../AlbumCard/AlbumCard";
import "./Albums.css";

const Albums = (props) => {
  const [Albums, setAlbums] = useState({
    albumList: [],
    isLoading: true,
    isError: false,
  });

  const fetchAlbumList = async () => {
    const artistId = props.artistId;
    try {
      const response = await fetch(
        `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/albums`
      );
      const AlbumsInfo = await response.json();
      AlbumsInfo.data.sort((a, b) => b.fans - a.fans);
      console.log("Albums: ", AlbumsInfo.data);
      setAlbums({
        albumList: AlbumsInfo.data,
        isLoading: false,
        isError: false,
      });
    } catch (error) {
      console.log(error);
      setAlbums({
        albumList: [],
        isLoading: false,
        isError: true,
      });
    }
  };

  useEffect(() => {
    fetchAlbumList();
  }, []);

  return (
    <>
      <Row className="Albums mx-0">
        <h2>Albums</h2>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6">
          {Albums.isLoading && <h1>Loading...</h1>}
          {Albums.isError && <h1>There was an error</h1>}
          {!Albums.isLoading &&
            Albums.albumList.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
        </Row>
      </Row>
    </>
  );
};

export default Albums;
