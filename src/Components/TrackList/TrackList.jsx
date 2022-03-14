import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./TrackList.css";

const TrackList = () => {
  const albumStatus = useSelector((state) => state.selectedAlbum.status);
  const trackList = useSelector(
    (state) => state.selectedAlbum.album.tracks.data
  );

  return (
    <Container className="TrackList" fluid>
      {albumStatus === "loading" && <h2 className="p-4">Loading...</h2>}
      {albumStatus === "failed" && (
        <h1 className="p-4">There was an error retrieving the information</h1>
      )}
      {albumStatus === "succeded" && (
        <Container className="table" fluid>
          <Row className="table-header">
            <Col xs={1}>
              <div className="d-flex justify-content-center">#</div>
            </Col>
            <Col className="header-title p-0">
              <div className="d-flex">
                <span>TITLE</span>
              </div>
            </Col>
            <Col xs={3}>
              <div className="time-icon">
                <svg
                  role="img"
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                  // class="Svg-sc-1bi12j5-0 gSLhUO"
                >
                  <path d="M7.999 3h-1v5h3V7h-2V3zM7.5 0a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 14C3.916 14 1 11.084 1 7.5S3.916 1 7.5 1 14 3.916 14 7.5 11.084 14 7.5 14z"></path>
                  <path fill="none" d="M16 0v16H0V0z"></path>
                </svg>
              </div>
            </Col>
          </Row>
          {trackList?.map((track, i) => (
            <Row key={track.id} className="table-row">
              <Col className="d-flex flex-row justify-content-center" xs={1}>
                <div className="track-number">{i + 1}</div>
                <div className="play-btn">
                  <svg
                    height="16"
                    role="img"
                    width="16"
                    viewBox="0 0 24 24"
                    // class="WaNY0e0sSL2GquK9BIKv"
                  >
                    <polygon
                      points="21.57 12 5.98 3 5.98 21 21.57 12"
                      fill="white"
                    ></polygon>
                  </svg>
                </div>
              </Col>
              <Col className="p-0">
                <Row className="align-items-center p-0 m-0">
                  <div className="track-text">
                    <div className="track-title">{track.title}</div>
                    <span>
                      <Link to={`/Artist/${track.artist.id}`}>
                        {track.artist.name}
                      </Link>
                    </span>
                  </div>
                </Row>
              </Col>
              <Col xs="auto" sm={2} className="p-0">
                <Row className="align-items-center p-0 m-0">
                  <Col className="heart-icon d-none d-md-flex">
                    <svg
                      role="img"
                      height="16"
                      width="16"
                      viewBox="0 0 16 16"
                      // class="Svg-sc-1bi12j5-0 gSLhUO"
                    >
                      <path d="M13.764 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253A4.05 4.05 0 00.974 5.61c0 1.089.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195A4.052 4.052 0 0014.96 5.61a4.057 4.057 0 00-1.196-2.883zm-.722 5.098L8.58 13.048c-.307.36-.921.36-1.228 0L2.864 7.797a3.072 3.072 0 01-.905-2.187c0-.826.321-1.603.905-2.187a3.091 3.091 0 012.191-.913 3.05 3.05 0 011.957.709c.041.036.408.351.954.351.531 0 .906-.31.94-.34a3.075 3.075 0 014.161.192 3.1 3.1 0 01-.025 4.403z"></path>
                    </svg>
                  </Col>
                  <Col className="p-0">
                    {Math.floor(track.duration / 60)}:
                    {("0" + (track.duration % 60)).slice(-2)}
                  </Col>
                </Row>
              </Col>
            </Row>
          ))}
        </Container>
      )}
    </Container>
  );
};

export default TrackList;
