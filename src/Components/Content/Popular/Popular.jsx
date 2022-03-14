import { Col, Container, Image, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./Popular.css";

const Popular = () => {
  const trackStatus = useSelector(
    (state) => state.selectedArtist.topTrackList.status
  );
  const trackList = useSelector(
    (state) => state.selectedArtist.topTrackList.topTracks
  );

  return (
    <>
      {trackStatus === "loading" && <h2 className="p-4">Loading...</h2>}
      {trackStatus === "failed" && (
        <h1 className="p-4">There was an error retrieving the information</h1>
      )}
      {trackStatus === "succeded" && (
        <Row className="Popular mx-0">
          <h2>Popular</h2>
          <Container className="table" fluid>
            {trackList.map((track, i) => (
              <Row key={track.id} className="table-row align-items-center">
                <Col className="d-flex flex-row justify-content-center" xs={1}>
                  <div className="track-number">{i + 1}</div>
                  <div className="play-btn">
                    <svg height="16" role="img" width="16" viewBox="0 0 24 24">
                      <polygon
                        points="21.57 12 5.98 3 5.98 21 21.57 12"
                        fill="currentColor"
                      ></polygon>
                    </svg>
                  </div>
                </Col>
                <Col xs={9} md={7}>
                  <Row xs="auto" className="align-items-center">
                    <Col className="img-container">
                      <Image fluid src={track.album.cover_small} />
                    </Col>
                    <Col className="track-title">
                      <span>{track.title}</span>
                    </Col>
                  </Row>
                </Col>
                <Col className="d-none d-md-block" md={2}>
                  {track.rank.toLocaleString()}
                </Col>
                <Col xs={1} sm={2} className="p-0">
                  <Row xs="auto" className="align-items-center">
                    <Col className="heart-icon d-none d-md-flex">
                      <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
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
          <div>
            <div className="see-more-btn">SEE MORE</div>
          </div>
        </Row>
      )}
    </>
  );
};

export default Popular;
