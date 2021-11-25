import { Container } from "react-bootstrap";
import { Route } from "react-router";
import AlbumPage from "./AlbumPage/AlbumPage";
import Artist from "./Artist/Artist";
import Home from "./Home/Home";
import Navbar from "../NavBar";
import "./Content.css";
import YourLibrary from "../YourLibrary/YourLibrary";

const Content = () => {
  return (
    <Container className="Content p-0" fluid>
      {/* <Navbar /> */}
      <Route exact path="/home" component={Home} />
      <Route exact path="/library" component={YourLibrary} />
      <Route path="/Artist/:artistId" component={Artist} />
      <Route path="/Album/:albumId" component={AlbumPage} />
    </Container>
  );
};

export default Content;
