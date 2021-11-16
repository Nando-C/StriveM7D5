import { Component } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
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
              <Row className="info flex-column justify-content-end">
                <h1>{this.state.artist.name}</h1>
                <h4>
                  {this.state.artist.nb_fan.toLocaleString()} Monthly Listeners
                </h4>
              </Row>
            </Row>
            <Row className="mx-3">Albums</Row>
          </>
        )}
      </Container>
    );
  }
}

export default Artist;
