import { Component } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import Albums from "../Albums/Albums";
import Popular from "../Popular/Popular";
import "./Artist.css";

class Artist extends Component {
  state = {
    artist: {},
    isLoading: true,
    isError: false,
  };

  componentDidMount = async () => {
    const artistId = this.props.match.params.artistId;
    try {
      const response = await fetch(
        "https://striveschool-api.herokuapp.com/api/deezer/artist/" + artistId
      );
      const artistInfo = await response.json();
      console.log(artistInfo);
      this.setState({
        artist: artistInfo,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      this.setState({
        isLoading: false,
        isError: true,
      });
    }
  };

  render() {
    return (
      <Container fluid className="Artist p-0">
        {this.state.isLoading && <h1>Loading...</h1>}
        {this.state.isError && <h1>There was an error</h1>}
        {!this.state.isLoading && (
          <>
            <Row className="banner m-0">
              <Image src={this.state.artist.picture_xl} />
              <Row className="banner-text flex-column justify-content-end">
                <h1>{this.state.artist.name}</h1>
                <h4>
                  {this.state.artist.nb_fan.toLocaleString()} Monthly Listeners
                </h4>
              </Row>
              <Row className="mid-bg-colour"></Row>
            </Row>
            <Row className="artist-content m-0 px-3">
              <Row className="options mx-0">
                <div className="play-btn">
                  <svg
                    height="32"
                    role="img"
                    width="32"
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
                <div>
                  <div className="follow-btn">FOLLOW</div>
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
              <Popular artistId={this.props.match.params.artistId} />
              <Albums artistId={this.props.match.params.artistId} />
            </Row>
          </>
        )}
      </Container>
    );
  }
}

export default Artist;
