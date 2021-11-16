import { Component } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";

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
      <Container fluid className="Artist">
        <Row>
          <div className="banner"></div>
          {/* <Image src={this.state.artist.picture_xl} /> */}
          {/* <Col id="content">
            <h1>{this.state.artist.name} </h1>
            <Image src={this.state.artist.picture_big} fluid />
            <h1>Number of Followers{this.state.artist.nb_fan} </h1>
          </Col> */}
        </Row>
      </Container>
    );
  }
}

export default Artist;
