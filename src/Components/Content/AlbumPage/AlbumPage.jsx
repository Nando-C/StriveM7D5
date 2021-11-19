import { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TrackList from "../../TrackList/TrackList";
import "./AlbumPage.css";

const AlbumPage = (props) => {
  const [albumData, setAlbumData] = useState({
    albumInfo: {},
    isLoading: true,
    isError: false,
  });

  const albumId = props.match.params.albumId;
  console.log("albumId: ", albumId);

  const fetchAlbumData = async () => {
    // const artistId = props.artistId;
    try {
      const response = await fetch(
        `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`
      );
      const albumDataFetched = await response.json();
      //   albumDataFetched.data.sort((a, b) => b.rank - a.rank);
      console.log("albumDataFetched: ", albumDataFetched);
      setAlbumData({
        albumInfo: albumDataFetched,
        isLoading: false,
        isError: false,
      });
    } catch (error) {
      console.log(error);
      setAlbumData({
        albumInfo: [],
        isLoading: false,
        isError: true,
      });
    }
  };

  useEffect(() => {
    fetchAlbumData();
  }, []);

  return (
    <Container className="AlbumPage">
      {albumData.isLoading && <h1>Loading...</h1>}
      {albumData.isError && <h1>There was an error</h1>}
      {!albumData.isLoading && (
        <>
          <Row className="backgnd">
            <Row className="cover">
              <div className="cover-img">
                <Image fluid src={albumData.albumInfo.cover_big} />
              </div>
              <div className="cover-text">
                <h2>ALBUM</h2>
                <h1>{albumData.albumInfo.title}</h1>
                <div className="album-info d-flex">
                  <div>
                    <Image
                      roundedCircle
                      src={albumData.albumInfo.artist.picture_small}
                    />
                    <Link to={`/Artist/${albumData.albumInfo.artist.id}`}>
                      {albumData.albumInfo.artist.name}
                    </Link>
                  </div>
                  <span>{albumData.albumInfo.release_date.slice(0, 4)}</span>
                  <span>
                    {albumData.albumInfo.nb_tracks} songs,{" "}
                    {Math.floor(albumData.albumInfo.duration / 60)} min{" "}
                    {albumData.albumInfo.duration % 60} sec
                  </span>
                </div>
              </div>
            </Row>
            <Row className="mid-bg-colour"></Row>
          </Row>
          <Row className="album-content px-3">
            <Row className="options mx-0">
              <div className="play-btn">
                <svg
                  height="28"
                  role="img"
                  width="28"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <polygon
                    points="21.57 12 5.98 3 5.98 21 21.57 12"
                    fill="currentColor"
                  ></polygon>
                </svg>
                {/* <svg
                    height="32"
                    role="img"
                    width="32"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="5"
                      y="3"
                      width="4"
                      height="18"
                      fill="currentColor"
                    ></rect>
                    <rect
                      x="15"
                      y="3"
                      width="4"
                      height="18"
                      fill="currentColor"
                    ></rect>
                  </svg> */}
              </div>
              <div className="heart-btn">
                <svg
                  role="img"
                  height="32"
                  width="32"
                  viewBox="0 0 32 32"
                  class="Svg-sc-1bi12j5-0 gSLhUO"
                >
                  <path d="M27.672 5.573a7.904 7.904 0 00-10.697-.489c-.004.003-.425.35-.975.35-.564 0-.965-.341-.979-.354a7.904 7.904 0 00-10.693.493A7.896 7.896 0 002 11.192c0 2.123.827 4.118 2.301 5.59l9.266 10.848a3.196 3.196 0 004.866 0l9.239-10.819A7.892 7.892 0 0030 11.192a7.896 7.896 0 00-2.328-5.619zm-.734 10.56l-9.266 10.848c-.837.979-2.508.979-3.346 0L5.035 16.104A6.9 6.9 0 013 11.192 6.9 6.9 0 015.035 6.28a6.935 6.935 0 014.913-2.048 6.89 6.89 0 014.419 1.605A2.58 2.58 0 0016 6.434c.914 0 1.555-.53 1.619-.585a6.908 6.908 0 019.346.431C28.277 7.593 29 9.337 29 11.192s-.723 3.6-2.062 4.941z"></path>
                </svg>
              </div>
              <div className="ellipsis-btn">
                <svg
                  role="img"
                  height="32"
                  width="32"
                  viewBox="0 0 32 32"
                  class="Svg-sc-1bi12j5-0 gSLhUO"
                >
                  <path d="M5.998 13.999A2 2 0 105.999 18a2 2 0 00-.001-4zm10.001 0A2 2 0 1016 18a2 2 0 000-4zm10.001 0A2 2 0 1026.001 18 2 2 0 0026 14z"></path>
                </svg>
              </div>
            </Row>
            <TrackList albumId={albumData.albumInfo.id} />
          </Row>
        </>
      )}
    </Container>
  );
};

export default AlbumPage;
