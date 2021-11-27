import { Component } from "react";
import { Row } from "react-bootstrap";
import AlbumCard from "./Content/AlbumCard/AlbumCard";

class CardsDeck extends Component {
  state = {
    albumCollection: [],
    isLoading: true,
    isError: false,
  };

  componentDidMount = async () => {
    try {
      const response = await fetch(
        "https://striveschool-api.herokuapp.com/api/deezer/search?q=the"
      );
      const albums = await response.json();
      // console.log('albums', albums.data)
      const uniqueAlbums = albums.data.filter(
        (alb, index, array) =>
          array.findIndex((a) => a.album.title === alb.album.title) === index
      );
      console.log("Unicos", uniqueAlbums);
      this.setState({
        albumCollection: uniqueAlbums,
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
      <div id="cardsDeck">
        <Row id="deckHeader">
          <h3 className="pl-3 mt-4">Recomended for today</h3>
        </Row>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 pb-5">
          {this.state.isLoading && <h1>Loading...</h1>}
          {this.state.isError && <h1>There was an error</h1>}
          {this.state.albumCollection.length === 0 &&
          this.state.isLoading === false &&
          this.state.isError === false ? (
            <h2>We dont have this collection</h2>
          ) : (
            this.state.albumCollection.map((album) => (
              <AlbumCard key={album.id} album={album} source="home" />
            ))
          )}
        </Row>
      </div>
    );
  }
}

export default CardsDeck;
